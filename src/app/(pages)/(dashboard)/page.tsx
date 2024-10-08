import { getAllCardStats } from './actions';
import LongCards from './components/Cards/LongCards';
import ShortCards from './components/Cards/ShortCards';

const Dashboard = async () => {
  const cardStats = await getAllCardStats();

  console.log(cardStats);
  return (
    <>
      <div className="flex-col flex gap-4">
        <ShortCards />
        <LongCards />
      </div>
    </>
  );
};

export default Dashboard;
