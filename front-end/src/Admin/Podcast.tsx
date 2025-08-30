import AddPodcastForm from "./components/Podcasts/AddPodcastForm";
import SearchPodcasts from "./components/Podcasts/SearchPodcasts";

const Podcasts = () => {
  return (
    <div className="my-5 flex flex-col gap-10">
      {/* Add Podcast */}
      <section className="bg-white p-5 rounded-xl shadow" dir="rtl">
        <h2 className="text-xl font-bold mb-4">افزودن پادکست جدید</h2>
        <AddPodcastForm />
      </section>

      {/* Edit Podcast */}
      <section className="bg-white p-5 rounded-xl shadow" dir="rtl">
        <SearchPodcasts />
      </section>
    </div>
  );
};

export default Podcasts;