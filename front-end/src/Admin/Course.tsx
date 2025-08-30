import AddCourseForm from './components/courses/AddCourseForm';
import EditCoursesPage from './components/courses/EditCoursePage';

const Course = () => {
  return (
    <div className="my-5 flex flex-col gap-10">
      {/* Add Article */}
      <section className="bg-white p-5 rounded-xl shadow" dir="rtl">
        <h2 className="text-xl font-bold mb-4">افزودن مقاله جدید</h2>
        <AddCourseForm />
      </section>

      {/* Edit Article */}
      <section className="bg-white p-5 rounded-xl shadow" dir="rtl">
        <EditCoursesPage />
      </section>
    </div>
  )
}

export default Course