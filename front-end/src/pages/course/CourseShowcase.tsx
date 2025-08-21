import CourseCard from "@/components/cards/CourseCard";
import axios from "axios";
import clsx from "clsx";
import { Heart, HeartCrack, SquareCheck, SquareX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Course } from "types/course";
import useRenderEditorContent from "@/hooks/useRenderEditorContent";
import authAxios from "@/lib/authAxios";
import { toast } from "sonner";

const levelMap = {
  beginner: "مبتدی",
  intermediate: "متوسط",
  advanced: "پیشرفته",
};

const fetchCourse = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/course/${id}`);
  const data = await res.json();
  return data.course as Course;
};

const checkIsJoined = async (id: string): Promise<boolean> => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await axios.get(`http://localhost:3000/api/courses/is-joined/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.isJoined;
  } catch {
    return false;
  }
};

const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const res = await authAxios.get(`/user/me`);
    return res.data;
  } catch {
    return false;
  }
}

const CourseShowcase = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openTopic, setOpenTopic] = useState<number[]>([]);

  // Fetch course data using useQuery
  const { data: course, isPending, error } = useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourse(id!),
    enabled: !!id,
  });

  // Check if user is joined
  const { data: isJoined } = useQuery({
    queryKey: ["isJoined", id],
    queryFn: () => checkIsJoined(id!),
    enabled: !!id,
  });

  const {
    data: currentUser,
  } = useQuery({
    queryKey: ["get-user-w-jwt"],
    queryFn: getUser,
    enabled: !!localStorage.getItem("token"),
  });
  // @ts-ignore
  const isFavorited = currentUser?.favoriteCourses?.some(v => v._id === id);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/user/favorite/course/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در افزودن دوره به علاقه‌مندی‌ها");
      return data;
    },
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries(['get-user-w-jwt']);
    },
    onError: (err: any) => {
      toast.error(err.message || "مشکلی در افزودن علاقه‌مندی پیش آمد");
    },
  });

  const joinCourseMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.post(`http://localhost:3000/api/courses/join/${course?._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isJoined", id] });
      navigate(`content`);
    },
    onError: (err: any) => {
      console.error("Failed to join course:", err);
      const message = err.response?.data?.message || "Something went wrong.";
      alert(message);
    },
  });

  const handleTopicClick = (index: number) => {
    if (openTopic.includes(index)) {
      setOpenTopic(openTopic.filter((item) => item !== index));
    } else {
      setOpenTopic([...openTopic, index]);
    }
  };

  const handleJoinClick = () => {
    if (isJoined) {
      navigate(`content`);
    } else {
      if (!localStorage.getItem("token")) {
        navigate("/auth");
        return;
      }
      joinCourseMutation.mutate();
    }
  };

  const renderLongDesc = useRenderEditorContent(course?.longDesc)

  if (isPending) return <div className="p-6 text-center text-lg font-semibold text-gray-600">Loading...</div>;
  if (error || !course) return <div className="p-6 text-center text-lg font-semibold text-red-600">Course not found.</div>;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 flex flex-col items-center min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="w-full text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
          {course.title}
        </h3>
      </div>

      {/* Main Content */}
      <div className="w-full flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* Course Info Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-6">
            <div className="bg-blue-50 rounded-lg px-4 py-3 flex items-center justify-end gap-4">
              <p className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                <span>{course.joinedBy ? course.joinedBy.length : 0}</span>
                :تعداد دانشجویان
              </p>
              <svg width="21" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.7828 28.9859C20.7836 27.7051 20.532 26.4366 20.0424 25.2531C19.5528 24.0695 18.8347 22.9941 17.9293 22.0881C17.0239 21.1822 15.9489 20.4635 14.7656 19.9732C13.5824 19.4828 12.3141 19.2305 11.0333 19.2305C9.75245 19.2305 8.48418 19.4828 7.30093 19.9732C6.11768 20.4635 5.04263 21.1822 4.13723 22.0881C3.23182 22.9941 2.51379 24.0695 2.02418 25.2531C1.53456 26.4366 1.28295 27.7051 1.28372 28.9859H20.7828Z" stroke="black" />
                <path d="M14.3827 12.5107C15.382 13.1423 15.2556 13.7675 15.0109 14.3498C14.7662 14.9321 14.4081 15.4599 13.9574 15.9024C13.5067 16.3449 12.9725 16.6932 12.3858 16.9272C11.7991 17.1612 11.1717 17.2761 10.5402 17.2652C9.27591 17.2148 8.08108 16.6734 7.20969 15.756C6.3383 14.8386 5.85905 13.6175 5.8738 12.3522V5.73123C5.87369 5.72283 5.87658 5.71465 5.88197 5.70819C5.88735 5.70174 5.89486 5.69741 5.90315 5.69601C7.5102 5.45214 9.13209 5.31878 10.7574 5.29688C12.3126 5.31776 13.8643 5.45115 15.4003 5.69601C15.4097 5.69601 15.4186 5.69972 15.4252 5.70633C15.4318 5.71293 15.4355 5.72189 15.4355 5.73123L15.3827 12.5107Z" stroke="black" />
                <path d="M4.87382 7.89688L1.01958 5.6664C1.01352 5.66206 1.00859 5.65633 1.00518 5.64969C1.00178 5.64306 1 5.63571 1 5.62825C1 5.62079 1.00178 5.61344 1.00518 5.60681C1.00859 5.60017 1.01352 5.59444 1.01958 5.5901L10.6341 1H10.6694L20.2546 5.54314C20.2606 5.54679 20.2657 5.55195 20.2692 5.55813C20.2726 5.5643 20.2745 5.57127 20.2745 5.57836C20.2745 5.58545 20.2726 5.59242 20.2692 5.59859C20.2606 5.60476 20.2546 5.60992 20.2546 5.61358L15.4355 7.89688" stroke="black" />
                <path d="M4.87381 10.3682H4.51204C4.51204 10.3682 3.3381 10.3682 3.3381 12.1878C3.3381 13.8665 4.51204 13.8665 4.51204 13.8665H6.1086" stroke="black" />
                <path d="M14.3827 10.5791H16.7445C16.7445 10.5791 17.9184 10.5791 17.9184 12.3928C17.9184 14.0716 16.7445 14.0716 16.7445 14.0716H15.1421" stroke="black" />
                <path d="M18.7498 15.5335V5.88965" stroke="black" />
                <path d="M18.7498 18.0337C20.4402 18.0337 21 17.4739 21 16.7834C21 16.093 20.4402 15.5332 19.7498 15.5332C19.0593 15.5332 18.4995 16.093 18.4995 16.7834C18.4995 17.4739 19.0593 18.0337 19.7498 18.0337Z" stroke="black" />
                <path d="M14.4355 9.57585C13.896 9.29613 12.3338 9.16054 10.7691 9.17084C9.1278 9.13791 7.48742 9.27362 5.87381 9.57585" stroke="black" />
              </svg>
            </div>
            <p className="flex justify-end gap-3 text-sm sm:text-base text-gray-600">
              <span className="text-nowrap">{course.category.name}</span>
              :دسته بندی
              <svg width="24" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 11.3075C12.4208 11.3075 12.3425 11.29 12.265 11.2558L0.361789 5.92917C0.137626 5.82917 -0.00487249 5.6 0.000127439 5.34417C0.00512737 5.09167 0.159292 4.8625 0.383455 4.775L12.2883 0.0408332C12.3566 0.0141665 12.4275 0 12.5 0C12.5716 0 12.6433 0.0141665 12.7116 0.0408332L24.6156 4.77333C24.8448 4.865 24.9948 5.08833 24.9998 5.3425C25.0064 5.59917 24.8639 5.82917 24.6381 5.92917L12.7341 11.2583C12.6599 11.2908 12.58 11.3075 12.5 11.3075ZM2.18843 5.39L12.4708 9.99167L22.8115 5.39L12.5 1.29083L2.18843 5.39Z" fill="#555555" />
                <path d="M-1.361762 10.4075C0.0609332 10.2716 -0.0798981 9.90413 0.0484334 9.58829C0.142599 9.35913 0.358429 9.20996 0.597592 9.20996C0.678424 9.20996 0.756757 9.22746 0.832589 9.26163L12.4716 14.4691L24.1689 9.26163C24.2456 9.22663 24.3239 9.20996 24.4048 9.20996C24.6431 9.20996 24.8581 9.35746 24.9514 9.58829C25.0806 9.90413 24.9398 10.2716 24.6381 10.4075L12.4999 15.8391L0.361762 10.4075Z" fill="#555555" />
                <path d="M-1.361775 14.566C0.0601128 14.4293 -0.0807185 14.0626 0.0484464 13.7485C0.142612 13.5193 0.358442 13.3701 0.597605 13.3701C0.678437 13.3701 0.75677 13.3876 0.832602 13.421L12.4716 18.6293L24.1689 13.421C24.2439 13.3885 24.3239 13.3701 24.4048 13.3701C24.6431 13.3701 24.8581 13.5193 24.9514 13.7485C25.0806 14.0635 24.9398 14.431 24.6389 14.566L12.4999 19.9993L0.361775 14.566Z" fill="#555555" />
              </svg>
            </p>
            <p className="flex justify-end gap-3 text-sm sm:text-base text-gray-600">
              <span>{levelMap[course.level.toLowerCase() as keyof typeof levelMap]}</span>
              :سطح دوره
              <svg width="24" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.25 8.99902V20.999M12.25 8.99902C12.25 6.19876 12.25 4.79864 11.705 3.72907C11.2256 2.78826 10.4607 2.02336 9.51995 1.54399C8.45039 0.999023 7.05026 0.999023 4.25 0.999023H3C2.29994 0.999023 1.9499 0.999024 1.68251 1.13526C1.44731 1.25511 1.25609 1.44634 1.13624 1.68154C1 1.94892 1 2.29896 1 2.99902V16.499C1 17.1991 1 17.5491 1.13624 17.8165C1.25609 18.0518 1.44731 18.2429 1.68251 18.3628C1.9499 18.499 2.29994 18.499 3 18.499H6.68335C7.35859 18.499 7.6962 18.499 8.02268 18.5573C8.31244 18.6089 8.59513 18.6944 8.86489 18.8123C9.1688 18.9449 9.44971 19.1321 10.0115 19.5068L12.25 20.999M12.25 8.99902C12.25 6.19876 12.25 4.79864 12.795 3.72907C13.2744 2.78826 14.0393 2.02336 14.98 1.54399C16.0496 0.999023 17.4497 0.999023 20.25 0.999023H21.5C22.2001 0.999023 22.5501 0.999024 22.8175 1.13526C22.0528 1.25511 23.2439 1.44634 23.3638 1.68154C23.5 1.94892 23.5 2.29896 23.5 2.99902V16.499C23.5 17.1991 23.5 17.5491 23.3638 17.8165C23.2439 18.0518 23.0528 18.2429 22.8175 18.3628C22.5501 18.499 22.2001 18.499 21.5 18.499H17.8166C17.1414 18.499 16.8037 18.499 16.4774 18.5573C16.1875 18.6089 15.9049 18.6944 15.6351 18.8123C15.3313 18.9449 15.0503 19.1321 14.4885 19.5068L12.25 20.999" stroke="#555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </p>
            <p className="flex justify-end gap-3 text-sm sm:text-base text-gray-600">
              {`ساعت ${course.time}`}
              <svg width="21" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 5.44347V10.999H14.3333M21 10.999C21 16.5219 16.5229 20.999 11 20.999C5.47716 20.999 1 16.5219 1 10.999C1 5.47618 5.47716 0.999023 11 0.999023C16.5229 0.999023 21 5.47618 21 10.999Z" stroke="#555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </p>
            <p className="flex justify-end gap-3 text-sm sm:text-base text-gray-600">
              <span className="flex flex-col items-end gap-3">
                <span className="flex justify-end gap-3">
                  :اهداف دوره
                  <svg width="17" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 7.26772L6.27419 11.5417L15.8169 1.99902" stroke="#555555" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <span className="text-end text-sm leading-7 text-gray-600">
                  {course.goal}
                </span>
              </span>
            </p>
            <button
              onClick={handleJoinClick}
              disabled={joinCourseMutation.isPending}
              className={clsx(
                "w-full rounded-lg bg-green-500 text-white py-3 font-bold text-sm sm:text-base hover:bg-green-600 transition-all duration-300 disabled:opacity-50 cursor-pointer"
              )}
            >
              {joinCourseMutation.isPending ? "Joining..." : isJoined ? "ادامه دوره" : "شروع دوره"}
            </button>
            {currentUser &&
              <button
                onClick={() => toggleFavoriteMutation.mutate()}
                className={clsx(
                  "px-4 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer flex items-center justify-center gap-1",
                  isFavorited ? "bg-rose-100 text-rose-600 hover:bg-rose-200" : "bg-red-100 text-red-600 hover:bg-red-200"
                )}
              >
                {isFavorited ? <HeartCrack size={20} /> : <Heart size={20} fill="#dc2626" />}
                <span>{isFavorited ? " حذف از علاقه‌مندی‌ها" : "️ افزودن به علاقه‌مندی‌ها"}</span>
              </button>
            }
          </div>
          {/* Share Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center gap-6">
            <p className="flex items-center gap-3 font-bold text-sm sm:text-base text-gray-700">
              به دوستان نیز معرفی کنید
              <svg width="22" height="28" viewBox="0 0 23 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 13.5996C8 15.5326 6.43299 17.0996 4.5 17.0996C2.56701 17.0996 1 15.5326 1 13.5996C1 11.6666 2.56701 10.0996 4.5 10.0996C6.43299 10.0996 8 11.6666 8 13.5996Z" stroke="black" stroke-width="2" />
                <path d="M14 5.90039L8 10.8004" stroke="black" stroke-width="2" stroke-linecap="round" />
                <path d="M14 21.3004L8 16.4004" stroke="black" stroke-width="2" stroke-linecap="round" />
                <path d="M21 22.7002C22 24.6332 20.433 26.2002 18.5 26.2002C16.567 26.2002 15 24.6332 15 22.7002C15 20.7672 16.567 19.2002 18.5 19.2002C20.433 19.2002 22 20.7672 22 22.7002Z" stroke="black" stroke-width="2" />
                <path d="M21 4.5C22 6.43299 20.433 8 18.5 8C16.567 8 15 6.43299 15 4.5C15 2.56701 16.567 1 18.5 1C20.433 1 22 2.56701 22 4.5Z" stroke="black" stroke-width="2" />
              </svg>
            </p>
            <p
              className="p-3 border border-gray-200 hover:border-gray-400 transition-all cursor-pointer rounded-xl text-sm text-gray-600 break-all"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              {window.location.href}
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="cursor-pointer hover:scale-110 hover:brightness-90 transition-all">
                <svg width="39" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0.200195C8.9543 0.200195 0 9.15449 0 20.2002C0 31.2459 8.9543 40.2002 20 40.2002C31.0457 40.2002 40 31.2459 40 20.2002C40 9.15449 31.0457 0.200195 20 0.200195ZM20.3848 17.1839C20.3914 17.1842 20.3977 17.1855 20.4044 17.1858C20.336 16.8927 20.3006 16.5871 20.3006 16.2732C20.3006 14.0617 22.0937 12.2686 24.3055 12.2686C25.4572 12.2686 26.4979 12.755 27.2284 13.5333C27.9784 13.3857 28.6881 13.1291 29.3479 12.7893C29.487 12.7218 29.6265 12.6547 29.7635 12.5804C29.5261 13.3096 29.0804 13.9407 28.5025 14.4189C28.3459 14.542 28.1852 14.6609 28.0083 14.7582C28.0203 14.7568 28.032 14.7542 28.044 14.7527C28.0323 14.76 28.0225 14.7699 28.0105 14.7771C28.667 14.6986 29.2964 14.5387 29.8942 14.3129C30.0282 14.2666 30.162 14.2198 30.2948 14.1682C29.7602 14.9618 29.0875 15.66 28.3123 16.2196C28.32 16.3913 28.3239 16.5639 28.3239 16.7377C28.3239 22.0296 24.2959 28.1316 16.9298 28.1316C14.6684 28.1316 12.5634 27.4688 10.7911 26.3325C11.1044 26.3695 11.4233 26.3884 11.7465 26.3884C13.2415 26.3884 14.6382 25.9768 15.8389 25.2681C16.1413 25.0939 16.4372 24.9057 16.7196 24.6927C16.712 24.6925 16.705 24.6907 16.6973 24.6905C16.7047 24.6848 16.7127 24.6799 16.7199 24.6742C15.2026 24.6462 13.893 23.7727 13.2376 22.5064C13.1399 22.312 13.0563 22.1083 12.9904 21.8946C13.2315 21.94 13.4784 21.9648 13.7326 21.9648C13.9975 21.9648 14.2534 21.9307 14.5037 21.8818C14.5973 21.8686 14.6917 21.8577 14.7839 21.8425C14.7717 21.84 14.761 21.8347 14.7488 21.8321C14.7615 21.8289 14.7751 21.8278 14.7876 21.8243C12.9556 21.4564 11.5752 19.8378 11.5752 17.8976C11.5752 17.8823 11.5753 17.8674 11.5755 17.8523L11.5773 17.848C12.0087 18.0874 12.4909 18.2458 13.0016 18.3121C13.1273 18.3331 13.2532 18.3524 13.3791 18.3634C13.3705 18.3576 13.363 18.3506 13.3545 18.3448C13.3664 18.3453 13.3777 18.3476 13.3895 18.348C12.3149 17.63 11.608 16.404 11.608 15.0147C11.608 14.3786 11.7633 13.7814 12.0273 13.2473C12.0694 13.167 12.1068 13.085 12.1552 13.0071C13.9295 15.1807 16.4923 16.6768 19.4052 17.0814C19.7302 17.1286 20.0562 17.1707 20.3859 17.1898C20.3855 17.1879 20.3853 17.1858 20.3848 17.1839Z" fill="#D1D1D1" />
                </svg>
              </div>
              <div className="cursor-pointer hover:scale-110 hover:brightness-90 transition-all">
                <svg width="40" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M39.5 20.2002C40.5 31.2458 31.5456 40.2002 20.5 40.2002C9.4543 40.2002 0.5 31.2458 0.5 20.2002C0.5 9.1545 9.4543 0.200195 20.5 0.200195C31.5456 0.200195 40.5 9.1545 40.5 20.2002ZM10.51 14.2002C10.51 13.1002 11.4 12.2002 12.5 12.2002H28.5C29.6 12.2002 30.5 13.1002 30.5 14.2002V26.2002C30.5 27.3002 29.6 28.2002 28.5 28.2002H12.5C11.4 28.2002 10.5 27.3002 10.5 26.2002L10.51 14.2002ZM20.5 21.2002L12.5 16.2001V26.2002H28.5V16.2001L20.5 21.2002ZM20.5 19.2002L12.5 14.2002H28.5L20.5 19.2002Z" fill="#D1D1D1" />
                </svg>
              </div>
              <div className="cursor-pointer hover:scale-110 hover:brightness-90 transition-all">
                <svg width="39" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.0413 11.0898C15.0689 11.0898 11.0222 15.1365 11.02 20.1112C11.0195 21.6956 11.436 23.2556 12.224 24.621C12.3427 24.8267 12.3738 25.0712 12.3115 25.3001L11.312 28.9503L15.0764 27.9627C15.1507 27.9432 15.2262 27.9338 15.3018 27.9338C15.4493 27.9338 15.596 27.9707 15.7275 28.0423C17.0435 28.7601 18.5338 29.1396 20.0382 29.1401C25.0147 29.1401 29.0613 25.093 29.0635 20.1178C29.0644 17.7072 28.1271 15.4405 26.424 13.7356C24.7204 12.0303 22.4538 11.0907 20.0413 11.0898ZM25.2364 23.5623C25.0253 24.1534 24.0142 24.6934 23.528 24.7658C23.092 24.8312 22.54 24.8583 21.9338 24.6654C21.5662 24.549 21.0947 24.393 20.4907 24.1321C17.952 23.0356 16.2938 20.4792 16.1671 20.3103C16.0404 20.1414 15.1338 18.9378 15.1338 17.6921C15.1338 16.4463 15.7875 15.8338 16.0195 15.5805C16.2515 15.3272 16.5258 15.2641 16.6947 15.2641C16.8635 15.2641 17.0324 15.2658 17.18 15.273C17.3355 15.281 17.544 15.2138 17.7493 15.7076C17.9604 16.2143 18.4662 17.4605 18.5298 17.5872C18.5933 17.7138 18.6351 17.8614 18.5507 18.0307C18.4662 18.1996 18.424 18.305 18.2978 18.453C18.1715 18.601 18.032 18.7832 17.9182 18.8965C17.7915 19.0227 17.6595 19.1596 17.8071 19.413C17.9547 19.6663 18.4627 20.4952 19.2151 21.1667C20.1818 22.0294 20.9973 22.2965 21.2507 22.4232C21.5035 22.5498 21.6515 22.529 21.7991 22.3596C21.9467 22.1907 22.432 21.6205 22.6009 21.3672C22.7698 21.1138 22.9382 21.1561 23.1702 21.2405C23.4022 21.325 24.6467 21.9374 24.8995 22.0641C25.1524 22.1907 25.3213 22.2543 25.3849 22.3596C25.4475 22.4645 25.4475 22.9712 25.2364 23.5623Z" fill="#D1D1D1" />
                  <path d="M19 0.200195C8.95422 0.200195 0 9.15442 0 20.2002C0 31.246 8.95422 40.2002 20 40.2002C31.0458 40.2002 40 31.246 40 20.2002C40 9.15442 31.0458 0.200195 20 0.200195ZM20.0418 30.9171C18.3573 30.9166 16.6902 30.5206 15.1947 29.7691L10.2738 31.0597C10.1996 31.0793 10.1236 31.0886 10.0484 31.0886C9.81422 31.0886 9.58578 30.9958 9.41644 30.8246C9.19333 30.5989 9.10711 30.2713 9.19111 29.9646L10.5018 25.178C9.67644 23.6233 9.24222 21.8784 9.24267 20.1086C9.24444 14.1553 14.0893 9.31131 20.0418 9.31131C22.9298 9.3122 25.6431 10.4371 27.6813 12.4784C29.72 14.5193 30.8418 17.2326 30.8409 20.118C30.8391 26.0726 25.9942 30.9171 20.0418 30.9171Z" fill="#D1D1D1" />
                </svg>
              </div>
              <div className="cursor-pointer hover:scale-110 hover:brightness-90 transition-all">
                <svg width="40" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.5 0.200195C16.5445 0.200195 12.6776 1.37317 9.3886 3.5708C6.09962 5.76842 3.53617 8.892 2.02242 12.5465C0.508674 16.2009 0.112598 20.2224 0.884298 24.1019C1.656 27.9817 3.56082 31.5452 6.35787 34.3424C9.15492 37.1394 12.7186 39.0442 16.5982 39.8159C20.4777 40.5877 24.4992 40.1914 28.1537 38.6777C31.8083 37.1639 34.9318 34.6007 37.1295 31.3117C39.327 28.0227 40.5 24.1559 40.5 20.2002C40.5 14.8959 38.3928 9.8088 34.6423 6.05807C30.8915 2.30732 25.8043 0.200195 20.5 0.200195ZM30.325 13.9002L27.05 29.3752C26.8 30.4752 26.15 30.7252 25.225 30.2252L20.225 26.5252L17.725 28.8502C17.6073 29.0039 17.456 29.1289 17.2828 29.2157C17.1095 29.3022 16.9187 29.3482 16.725 29.3502L17.075 24.3502L26.325 15.9752C26.75 15.6252 26.325 15.4252 25.725 15.7752L14.375 22.9002L9.375 21.3502C8.3 21.0252 8.275 20.2752 9.6 19.7752L28.875 12.2752C29.825 12.0002 30.625 12.5502 30.325 13.9002Z" fill="#D1D1D1" />
                </svg>
              </div>
              <div className="cursor-pointer hover:scale-110 hover:brightness-90 transition-all">
                <svg width="41" height="41" viewBox="0 0 42 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 0.200195C9.95312 0.200195 1 9.15332 1 20.2002C1 31.2471 9.95312 40.2002 21 40.2002C32.0469 40.2002 41 31.2471 41 20.2002C41 9.15332 32.0469 0.200195 21 0.200195ZM25.4141 16.8096L25.1875 19.8018H22.1172V30.1924H18.2422V19.8018H16.1719V16.8096H18.2422V14.8018C18.2422 13.9189 18.2656 12.5518 18.9062 11.7002C19.5859 10.8018 20.5156 10.1924 22.1172 10.1924C24.7266 10.1924 25.8203 10.5674 25.8203 10.5674L25.3047 13.6299C25.3047 13.6299 24.4453 13.3799 23.6406 13.3799C22.8359 13.3799 22.1172 13.6689 22.1172 14.4736V16.8096H25.4141Z" fill="#D1D1D1" stroke="#D1D1D1" stroke-width="0.390625" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* Right Content */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="w-full rounded-xl overflow-hidden shadow-lg">
            <img src={course.thumbnail} alt={course.title} className="w-full h-auto object-cover" />
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 items-end">
            <h2 className="font-bold text-base sm:text-lg text-gray-800">:توضیحات کوتاه</h2>
            <p className="text-end text-sm text-gray-600">{course.shortDesc}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-6" dir="rtl">
            {renderLongDesc}
            <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
              <h2 className="font-bold text-lg sm:text-xl text-gray-800">سرفصل های دوره</h2>
              {course.topics.map((topic, index) => (
                <div className="w-full flex flex-col" key={`${topic.head}-index-${index}`}>
                  <p
                    onClick={() => handleTopicClick(index)}
                    className={clsx(
                      "border border-gray-200 hover:border-gray-400 rounded-lg w-full py-2.5 px-4 cursor-pointer flex gap-3 text-sm sm:text-base transition-all duration-300",
                      openTopic.includes(index) && "border-b-0 rounded-b-none border-gray-400"
                    )}
                  >
                    {openTopic.includes(index) ? (
                      <svg width="21" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 11H8" stroke="black" stroke-width="1.5" stroke-linecap="round" />
                        <path d="M20 11C21 15.714 21 18.0711 19.5355 19.5355C18.0711 21 15.714 21 11 21C6.28595 21 3.92893 21 2.46447 19.5355C1 18.0711 1 15.714 1 11C1 6.28595 1 3.92893 2.46447 2.46447C3.92893 1 6.28595 1 11 1C15.714 1 18.0711 1 19.5355 2.46447C20.5093 3.43821 20.8356 4.80655 20.9449 7" stroke="black" stroke-width="1.5" stroke-linecap="round" />
                      </svg>
                    ) : (
                      <svg width="21" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 11H11M11 11H8M11 11V8M11 11V14" stroke="black" stroke-width="1.5" stroke-linecap="round" />
                        <path d="M20 11C21 15.714 21 18.0711 19.5355 19.5355C18.0711 21 15.714 21 11 21C6.28595 21 3.92893 21 2.46447 19.5355C1 18.0711 1 15.714 1 11C1 6.28595 1 3.92893 2.46447 2.46447C3.92893 1 6.28595 1 11 1C15.714 1 18.0711 1 19.5355 2.46447C20.5093 3.43821 20.8356 4.80655 20.9449 7" stroke="black" stroke-width="1.5" stroke-linecap="round" />
                      </svg>
                    )}
                    {topic.head}
                  </p>
                  <p
                    className={clsx(
                      "text-sm text-gray-600 border-b border-l border-r p-3 rounded-b-lg border-gray-400 transition-all duration-300",
                      openTopic.includes(index) ? "opacity-100 max-h-[300px] overflow-auto" : "opacity-0 max-h-0 overflow-hidden"
                    )}
                  >
                    {topic.body}
                  </p>
                </div>
              ))}
            </div>
            {course.questions.map((question, index) => (
              <div className="border-b border-gray-200 pb-4" key={`${question.question}-index-${index}`}>
                <h3 className="font-bold text-base text-gray-800 mb-2">{question.question}</h3>
                <p className="text-sm text-gray-600">{question.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Related Courses */}
      {course.related && course.related.length > 0 && (
        <div className="w-full bg-white shadow-lg rounded-xl p-6 md:p-8 flex flex-col">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-6">دوره‌های مشابه</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {course.related.map((rel, index) => (
              <CourseCard key={`related-${index}`} course={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseShowcase;