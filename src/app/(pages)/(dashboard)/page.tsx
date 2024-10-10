import {
  getAllCardStats,
  getSalesByMonth,
  getSalesByStore,
  getSalesVSExpensesByDate,
} from './actions';
import LongCards from './components/Cards/LongCards';
import ShortCards from './components/Cards/ShortCards';

const Dashboard = async () => {
  const cardData = await getAllCardStats();
  const salesByMonth = await getSalesByMonth();
  const salesByStore = await getSalesByStore();
  const salesVsExpenses = await getSalesVSExpensesByDate();

  console.log(cardData);
  console.log(salesByMonth);
  console.log(salesByStore);
  console.log(salesVsExpenses);
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
