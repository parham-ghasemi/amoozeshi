type StatCardProps = {
  label: string;
  value: number;
};


const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <div className="bg-white w-52 h-36 rounded-xl shadow-lg p-4 flex flex-col items-center justify-center gap-2.5">
    <p className="text-sm text-gray-500 font-bold">{label}</p>
    <p className="text-5xl font-bold">{value}</p>
  </div>
);
export default StatCard;