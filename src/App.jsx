import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import UserProfile from "./pages/UserProfile";
import Portfolio from "./pages/Portfolio";
import Recommendations from "./pages/Recommendations";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <UserProfileProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/"                element={<Home />} />
            <Route path="/products"        element={<ProductListing />} />
            <Route path="/product/:id"     element={<ProductDetail />} />
            <Route path="/profile"         element={<UserProfile />} />
            <Route path="/portfolio"       element={<Portfolio />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="*"               element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </UserProfileProvider>
  );
}
