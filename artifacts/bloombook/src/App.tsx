import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { SplashScreen } from "@/components/splash-screen";
import { ErrorBoundary } from "@/components/error-boundary";

// Lazy load pages for better code splitting
const Dashboard = lazy(() => import("@/pages/dashboard"));
const MemoryWall = lazy(() => import("@/pages/memory-wall"));
const CafePassport = lazy(() => import("@/pages/cafe-passport"));
const Bookshelf = lazy(() => import("@/pages/bookshelf"));
const NetflixCorner = lazy(() => import("@/pages/netflix-corner"));
const SomedayList = lazy(() => import("@/pages/someday-list"));
const MemoryCapsules = lazy(() => import("@/pages/memory-capsules"));
const KitchenDiaries = lazy(() => import("@/pages/kitchen-diaries"));
const RandomReviews = lazy(() => import("@/pages/random-reviews"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-pulse mb-4">
          <div className="w-16 h-16 bg-bloom-pink-light rounded-full mx-auto"></div>
        </div>
        <p className="font-caveat text-bloom-text-soft">loading...</p>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SplashScreen />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
