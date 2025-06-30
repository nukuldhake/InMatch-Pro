import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Target, Search, Users, Trophy, Star, TrendingUp, Zap, AlertTriangle } from "lucide-react";

const features = [
  {
    title: "Live Match Predictor",
    description: "Real-time match predictions with score forecasting and win probability analysis",
    icon: BarChart,
    href: "/live-match-predictor",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Player Performance Predictor",
    description: "Predict individual player performance based on form and match conditions",
    icon: Target,
    href: "/player-performance-predictor",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Player Stats Lookup",
    description: "Comprehensive player statistics and performance analytics",
    icon: Search,
    href: "/player-stats-lookup",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Player Clustering",
    description: "AI-powered player grouping based on playing style and performance metrics",
    icon: Users,
    href: "/player-clustering",
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Fantasy Points Estimator",
    description: "Optimize your fantasy team with predicted fantasy points for each player",
    icon: Trophy,
    href: "/fantasy-points-estimator",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    title: "MVP Predictor",
    description: "Identify the Player of the Match using advanced performance metrics",
    icon: Star,
    href: "/mvp-predictor",
    color: "from-red-500 to-red-600",
  },
];

const stats = [
  { label: "Prediction Accuracy", value: "87.3%", icon: TrendingUp },
  { label: "Matches Analyzed", value: "1,000+", icon: BarChart },
  { label: "Players Tracked", value: "700+", icon: Users },
  { label: "MAE", value: "2.45", icon: AlertTriangle },
];

export default function Index() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
            InMatch Pro
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium">
            IPL Strategy Assistant
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Advanced AI-powered cricket analytics platform providing real-time predictions, 
            player insights, and strategic analysis for the Indian Premier League.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link to="/live-match-predictor">
              <BarChart className="mr-2 h-5 w-5" />
              Start Predicting
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/player-stats-lookup">
              <Search className="mr-2 h-5 w-5" />
              Explore Stats
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-2">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600">
            Comprehensive tools for cricket analysis and strategic decision making
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
                <CardHeader className="space-y-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant="outline">
                    <Link to={feature.href}>
                      Explore Feature
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to dominate your IPL predictions?</h2>
        <p className="text-lg mb-6 opacity-90">
          Join thousands of cricket enthusiasts using AI-powered insights to make smarter decisions.
        </p>
        <Button asChild size="lg" variant="secondary">
          <Link to="/live-match-predictor">
            Get Started Now
          </Link>
        </Button>
      </div>
    </div>
  );
}
