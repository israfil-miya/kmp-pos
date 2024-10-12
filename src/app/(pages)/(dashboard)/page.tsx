import { getAllInvoices } from '../invoices/actions';
import {
  getAllCardStats,
  getSalesByMonth,
  getSalesByStore,
  getSalesVSExpensesByDate,
} from './actions';
import LongCards from './components/Cards/LongCards';
import ShortCards from './components/Cards/ShortCards';
import Graphs from './components/Graphs/Graphs';
import Table from './components/Table';

const Dashboard = async () => {
  const cardData = await getAllCardStats();
  const salesByMonth = await getSalesByMonth();
  const salesByStore = await getSalesByStore();
  const salesVsExpenses = await getSalesVSExpensesByDate();
  const invoices = await getAllInvoices({
    page: 1,
    itemsPerPage: 5,
  });

  return (
    <>
      <div className="flex-col flex gap-4">
        <ShortCards cardData={cardData} />
        <LongCards cardData={cardData} />
        <Graphs
          salesByMonth={salesByMonth}
          salesByStore={salesByStore}
          salesVsExpenses={salesVsExpenses}
        />
        <Table invoices={invoices} />
      </div>
    </>
  );
};

export default Dashboard;
