import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { 
  BrainCircuit, 
  BarChart3, 
  Globe, 
  Settings2, 
  Zap, 
  Users, 
  Database,
  Activity,
  ShieldCheck,
  Code2,
  FileCode2,
  Cpu,
  LineChart
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const Route = createFileRoute('/admin')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { metrics, health, aiAnalysis, orgSettings, locale, setLocale } = useEnterpriseStore();

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-1">Global Enterprise Performance & Scalability Oversight</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setLocale('en')}>
            <Globe className="w-4 h-4 mr-2" />
            {locale.toUpperCase()}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Monthly Recurring Revenue" 
          value={`$${metrics.mrr.toLocaleString()}`} 
          sub="↑ 12.5% from last month"
          icon={<BarChart3 className="text-blue-500" />}
        />
        <MetricCard 
          title="Active Users" 
          value={metrics.activeUsers.toLocaleString()} 
          sub="Across 145 Organizations"
          icon={<Users className="text-orange-500" />}
        />
        <MetricCard 
          title="Churn Rate" 
          value={`${metrics.churn}%`} 
          sub="Retention: 97.6%"
          icon={<Activity className="text-red-500" />}
        />
        <MetricCard 
          title="AI Latency" 
          value={`${health.latency}ms`} 
          sub="Edge Performance: Optimal"
          icon={<Cpu className="text-emerald-500" />}
        />
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-6">
          <TabsTrigger value="analytics">Business Intel</TabsTrigger>
          <TabsTrigger value="ai">AI Generative</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="white-label">Enterprise</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Forecast (ARR)</CardTitle>
                <CardDescription>Real-time revenue tracking and projections</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.revenue}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="date" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3B82F6" fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Analysis</CardTitle>
                <CardDescription>AI-driven business recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Performance Prediction</span>
                    <span className="text-emerald-500 font-bold">{aiAnalysis.predictedPerformance}%</span>
                  </div>
                  <Progress value={aiAnalysis.predictedPerformance} className="bg-slate-800" />
                </div>
                
                <div className="pt-4 space-y-3">
                  {aiAnalysis.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800 text-sm">
                      <BrainCircuit className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Case Generator</CardTitle>
                  <CardDescription>Generate complete diagnostic scenarios using LLMs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Teacher Prompt</label>
                    <Input placeholder="E.g. Create a case about motor reversal with two contactors..." />
                  </div>
                  <div className="flex gap-2">
                    <Button className="w-full bg-blue-600">
                      <FileCode2 className="w-4 h-4 mr-2" />
                      Generate Draft
                    </Button>
                    <Button variant="outline">
                      <Settings2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Document Ingestion (RAG)</CardTitle>
                  <CardDescription>Extract knowledge from PDF, DOCX or Blueprints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3">
                    <Database className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Drag & drop technical files</p>
                      <p className="text-xs text-muted-foreground">AI will automatically generate embeddings & cases</p>
                    </div>
                    <Button variant="secondary" size="sm">Browse Files</Button>
                  </div>
                </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <HealthIndicator label="CPU Usage" value={health.cpu} />
            <HealthIndicator label="Memory" value={health.memory} />
            <HealthIndicator label="Storage" value={health.storage} />
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>API & Observability</CardTitle>
                <CardDescription>System-wide health and API performance</CardDescription>
              </div>
              <Badge variant="outline" className="text-emerald-500 border-emerald-500/50">
                <Activity className="w-3 h-3 mr-1" /> All Systems Operational
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-slate-800"><Code2 className="w-5 h-5 text-blue-400" /></div>
                    <div>
                      <p className="text-sm font-medium">Public API (v1)</p>
                      <p className="text-xs text-muted-foreground">Enabled • OAuth 2.0</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-slate-800"><Zap className="w-5 h-5 text-orange-400" /></div>
                    <div>
                      <p className="text-sm font-medium">Webhooks Engine</p>
                      <p className="text-xs text-muted-foreground">3 Active Endpoints</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-slate-800"><ShieldCheck className="w-5 h-5 text-emerald-400" /></div>
                    <div>
                      <p className="text-sm font-medium">Sentry / PostHog</p>
                      <p className="text-xs text-muted-foreground">100% Tracking Coverage</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-slate-800"><Database className="w-5 h-5 text-purple-400" /></div>
                    <div>
                      <p className="text-sm font-medium">Redis Cache</p>
                      <p className="text-xs text-muted-foreground">Hit Rate: 94.2%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="white-label">
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Customization</CardTitle>
              <CardDescription>White-label and organizational configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization Logo</label>
                  <div className="h-24 w-full border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center">
                    <Button variant="ghost">Upload SVG/PNG</Button>
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="space-y-2">
                    <label className="text-sm font-medium">Custom Domain</label>
                    <Input placeholder="lab.yourcompany.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Brand Primary Color</label>
                    <div className="flex gap-2">
                      <Input defaultValue="#3B82F6" className="w-32" />
                      <div className="w-10 h-10 rounded border border-slate-700 bg-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Preview Branding</Button>
                <Button>Save Enterprise Config</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: React.ReactNode }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-800">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HealthIndicator({ label, value }: { label: string, value: number }) {
  const colorClass = value > 80 ? 'text-red-500' : value > 50 ? 'text-orange-500' : 'text-emerald-500';
  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <span className={`text-xs font-bold ${colorClass}`}>{value}%</span>
        </div>
        <Progress value={value} className="h-1 bg-slate-800" />
      </CardContent>
    </Card>
  );
}
