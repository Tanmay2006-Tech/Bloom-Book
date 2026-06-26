import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { SplashScreen } from "@/components/splash-screen";

import Dashboard from "@/pages/dashboard";
import MemoryWall from "@/pages/memory-wall";
import CafePassport from "@/pages/cafe-passport";
import Bookshelf from "@/pages/bookshelf";
import NetflixCorner from "@/pages/netflix-corner";
import SomedayList from "@/pages/someday-list";
import MemoryCapsules from "@/pages/memory-capsules";
import KitchenDiaries from "@/pages/kitchen-diaries";
import RandomReviews from "@/pages/random-reviews";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/wall" component={MemoryWall} />
        <Route path="/cafes" component={CafePassport} />
        <Route path="/books" component={Bookshelf} />
        <Route path="/movies" component={NetflixCorner} />
        <Route path="/someday" component={SomedayList} />
        <Route path="/capsules" component={MemoryCapsules} />
        <Route path="/kitchen" component={KitchenDiaries} />
        <Route path="/reviews" component={RandomReviews} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SplashScreen />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
