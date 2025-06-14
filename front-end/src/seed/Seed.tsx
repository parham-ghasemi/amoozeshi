import axios from "axios";

const Seed = () => {
  const handleSeed = async() => {
    try {
      const seed = await axios.post('http://localhost:3000/seed')
      console.log(seed);
    } catch(e) {
      console.error('ERROR_SEEDING: ', e)
    }
  }

  return (
    <div className="h-screen w-screen bg-slate-900 flex justify-center items-center">
      <button className="py-14 px-24 text-4xl font-black bg-slate-50 rounded-lg cursor-pointer" onClick={handleSeed}> SEED </button>
    </div>
  )
}

export default Seed