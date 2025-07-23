import { Link } from "react-router-dom";
import type { CourseShort } from "types/course";

const CourseCard = ({ course }: { course: CourseShort }) => {
  return (
    <div className="h-[262px] sm:h-[362px] w-full max-w-xs mx-auto border rounded-xl overflow-hidden pb-2.5 relative hover:shadow-xl hover:scale-[102%] transition-transform cursor-context-menu">
      <img
        src={course.thumbnail}
        alt="course thumbnail"
        className="w-full h-24 sm:h-36 object-cover"
      />
      <div className="p-2 sm:p-2.5 space-y-2 sm:space-y-3.5">
        <p className="font-bold text-sm sm:text-base line-clamp-2">{course.title}</p>
        <p className="font-light text-xs sm:text-sm line-clamp-4">{course.shortDesc}</p>
      </div>
      <Link
        to={`/course/${course._id}`}
        className="absolute left-2 sm:left-2.5 right-2 sm:right-2.5 bottom-2 sm:bottom-2.5"
      >
        <button className="w-full rounded-md py-2 text-xs sm:text-sm bg-green-100 hover:bg-green-200 cursor-pointer">
          مشاهده دوره
        </button>
      </Link>
    </div>
  );
};

export default CourseCard;
