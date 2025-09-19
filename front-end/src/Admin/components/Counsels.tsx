import AddCounselForm from "./Counsels/AddCounselForm";
import EditCounselsPage from "./Counsels/EditCounselsPage";

const Counsels = () => {
  return (
    <div className="my-5 flex flex-col gap-10">
      {/* Add Counsel */}
      <section className="bg-white p-5 rounded-xl shadow" dir="rtl">
        <h2 className="text-xl font-bold mb-4">افزودن مشاوره جدید</h2>
        <AddCounselForm />
      </section>

      {/* Edit Counsel */}
      <section className="bg-white p-5 rounded-xl shadow" dir="rtl">
        <EditCounselsPage />
      </section>
    </div>
  );
};

export default Counsels;