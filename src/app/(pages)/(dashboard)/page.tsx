import { getAllCardStats } from './actions';
import LongCards from './components/Cards/LongCards';
import ShortCards from './components/Cards/ShortCards';

const Dashboard = async () => {
  const cardData = await getAllCardStats();

  console.log(cardData);
  return (
    <>
      <div className="flex-col flex gap-4">
        <ShortCards cardData={cardData} />
        <LongCards cardData={cardData} />
      </div>
    </>
  );
};

export default Dashboard;
