import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import TransactionPage from "../pages/TransactionPage";

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TransactionPage />} />
        <Route path="/transactions" element={<TransactionPage />} />
      </Routes>
    </Layout>
  );
}
