import AddVideoForm from "./components/Videos/AddVideosForm"
import SearchVideos from "./components/Videos/SearchVideos"

const Videos = () => {
  return (
    <div className="my-5 flex flex-col gap-10">
      {/* Add Article */}
      <section className="bg-white p-5 rounded-xl shadow" dir="rtl">
        <h2 className="text-xl font-bold mb-4">افزودن مقاله جدید</h2>
        <AddVideoForm />
      </section>

      {/* Edit Article */}
      <section className="bg-white p-5 rounded-xl shadow" dir="rtl">
        <h2 className="text-xl font-bold mb-4">ویرایش مقاله</h2>
        <SearchVideos />
      </section>
    </div>
  )
}

export default Videos