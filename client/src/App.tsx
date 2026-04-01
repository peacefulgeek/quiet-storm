import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage";
import CategoryPage from "./pages/CategoryPage";
import About from "./pages/About";
import StartHere from "./pages/StartHere";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CalmNow from "./pages/CalmNow";
import QuizPage from "./pages/QuizPage";
import Tools from "./pages/Tools";
import Assessments from "./pages/Assessments";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/articles" component={Articles} />
      <Route path="/article/:slug" component={ArticlePage} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/about" component={About} />
      <Route path="/start-here" component={StartHere} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/calm-now" component={CalmNow} />
      <Route path="/quiz/:quizSlug" component={QuizPage} />
      <Route path="/quizzes" component={Assessments} />
      <Route path="/tools" component={Tools} />
      <Route path="/assessments" component={Assessments} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
