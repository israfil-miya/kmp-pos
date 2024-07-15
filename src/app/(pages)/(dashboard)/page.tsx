import LongCards from './components/Cards/LongCards';
import ShortCards from './components/Cards/ShortCards';

const Dashboard = () => {
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
