import AddArticleForm from "./components/Articles/AddArticlesForm";
import EditArticlesPage from "./components/Articles/EditArticlesPage";

const Articles = () => {
  return (
    <div className="my-5 flex flex-col gap-10">
      {/* Add Article */}
      <section className="bg-white p-5 rounded-xl shadow" dir="rtl">
        <h2 className="text-xl font-bold mb-4">افزودن مقاله جدید</h2>
        <AddArticleForm />
      </section>

      {/* Edit Article */}
      <section className="bg-white p-5 rounded-xl shadow" dir="rtl">
        <h2 className="text-xl font-bold mb-4">ویرایش مقاله</h2>
        <EditArticlesPage />
      </section>
    </div>
  );
};

export default Articles;
