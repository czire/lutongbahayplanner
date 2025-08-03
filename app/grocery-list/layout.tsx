import Header from "@/components/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
};

export default Layout;
