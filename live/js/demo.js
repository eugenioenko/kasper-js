const DemoSourceCode = String.raw`
<!------------------------------------------------------------------------------
Kasper-JS Playground
------------------------------------------------------------------------------->

<div class="space-y-6">
  <!-- accessing component state -->
  <header class="flex justify-between items-start">
    <div>
      <h3 class="text-5xl font-mono leading-none tracking-tighter">{{user.name}}</h3>
      <h4 class="text-lg text-blue-400 font-mono mt-1">{{user.role}}</h4>
      <div class="mt-2 text-[10px] text-gray-600 font-mono uppercase">SESSION_UPTIME: {{uptime.value}}s</div>
    </div>
    <div class="text-right font-mono">
      <div class="text-[10px] text-gray-500 uppercase">Status</div>
      <div class="text-sm text-green-500 font-bold uppercase tracking-tighter">{{user.roleType}}</div>
    </div>
  </header>

  <!-- conditional rendering -->
  <section class="p-3 bg-gray-950/50 rounded border border-gray-800 flex justify-between items-center font-mono">
    <p @if="user.lastLogin" class="text-xs text-gray-500">
      Last Session: <span class="text-gray-300">{{user.lastLogin}}</span>
    </p>
    <p @else class="text-xs text-red-500 animate-pulse underline">Session Expired</p>
    <div class="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
  </section>

  <!-- iteration -->
  <section>
    <h4 class="text-[10px] font-bold mb-3 uppercase tracking-[0.3em] text-gray-600 font-mono">Active Proxy Nodes</h4>
    <div class="flex gap-2">
      <span @each="node of user.servers" 
            class="px-3 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700 text-[11px] font-mono cursor-crosshair hover:bg-blue-900/20 hover:border-blue-700/50 transition-all"
            @on:click="alert('Connecting to ' + node + '...')">
        {{node}}
      </span>
    </div>
  </section>

  <!-- method binding -->
  <section>
    <button class="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded font-mono text-xs font-bold transition-all shadow-lg active:scale-95 border-b-4 border-blue-800"
            @on:click="onClick()">
      INITIALIZE TERMINAL
    </button>
  </section>

  <!-- components & slots -->
  <section class="pt-6 border-t border-gray-800">
    <h4 class="text-lg font-bold mb-4 uppercase tracking-widest text-gray-500 font-mono">Components & Slots</h4>
    <div class="grid grid-cols-2 gap-4">
      <my-card @class="'border-blue-900/30'">
        <span slot="header">Profile Info</span>
        <p>This card uses <b>Named Slots</b> to organize content into header, body, and footer areas.</p>
        <span slot="footer" class="text-[10px] text-gray-500 font-mono">Last updated: Just now</span>
      </my-card>

      <my-card @class="'border-purple-900/30'">
        <span slot="header">Kasper Features</span>
        <ul class="list-disc list-inside space-y-1 text-sm text-gray-400">
          <li>Template Parsing</li>
          <li>Expression Evaluation</li>
          <li>Component Architecture</li>
          <li>Named Slots</li>
        </ul>
      </my-card>
    </div>
  </section>

  <!-- advanced loops -->
  <footer class="pt-6 border-t border-gray-800 text-[10px] text-gray-600 font-mono flex gap-4">
    <div @let="i = 0">
       WHILE LOOP: <span @while="i < 5" class="text-gray-400">{{++i}} </span>
    </div>
    <div class="border-l border-gray-800 pl-4">
       OBJECT ITERATION: <span @each="pair of Object.entries({A:1, B:2})" class="text-gray-400">{{pair[0]}} </span>
    </div>
  </footer>

  <!-- status dashboard section -->
  <section class="pt-8 mt-8 border-t border-gray-800">
    <div class="flex justify-between items-center mb-6">
      <h4 class="text-lg font-bold uppercase tracking-widest text-gray-500 font-mono">System Dashboard</h4>
      <span class="px-2 py-0.5 bg-green-900/20 text-green-500 text-[10px] font-mono border border-green-800/50 rounded">LIVE_SYNC</span>
    </div>
    
    <div class="grid grid-cols-4 gap-3">
      <div @each="stat of stats" 
           class="p-3 bg-gray-900/50 border border-gray-800 rounded-lg transition-all hover:scale-[1.02]"
           @class="stat.status === 'critical' ? 'border-red-900/50 bg-red-950/10' : (stat.status === 'warning' ? 'border-yellow-900/50' : 'border-gray-800')">
        
        <div class="flex justify-between items-start mb-2">
          <span class="text-[10px] font-mono text-gray-500 uppercase">{{stat.label}}</span>
          <div @if="stat.status === 'healthy'" class="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          <div @elseif="stat.status === 'warning'" class="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
          <div @else class="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-ping"></div>
        </div>

        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-mono font-bold tracking-tighter"
                @class="stat.status === 'critical' ? 'text-red-400' : (stat.status === 'warning' ? 'text-yellow-400' : 'text-white')">
            {{stat.value}}
          </span>
          <span class="text-xs text-gray-600 font-mono">{{stat.unit}}</span>
        </div>

        <div class="mt-3 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
          <div class="h-full transition-all duration-1000" 
               @style="'width: ' + stat.value + '%'"
               @class="stat.status === 'critical' ? 'bg-red-500' : (stat.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500')">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- expression power showcase -->
  <section class="mt-6 p-4 bg-blue-950/10 border border-blue-900/30 rounded-xl font-mono">
    <div class="flex justify-between items-center mb-4">
      <h5 class="text-xs font-bold text-blue-500 uppercase tracking-widest">Heuristic Analysis</h5>
      <span class="text-[10px] text-gray-600">ENGINE_V: {{typeof kasper.Transpiler}}</span>
    </div>
    
    <div class="space-y-2 text-xs">
      <div class="flex justify-between">
        <span class="text-gray-500">Threat Level:</span>
        <span @class="Math.max(stats[0].value, stats[1].value) > 80 ? 'text-red-500' : 'text-green-500'">
          {{ Math.max(stats[0].value, stats[1].value) > 80 ? "CRITICAL" : "STABLE" }}
        </span>
      </div>
      
      <div class="flex justify-between">
        <span class="text-gray-500">System Integrity:</span>
        <span class="text-blue-400">
          {{ Math.floor((stats[1].value + stats[2].value) / 2) }}%
        </span>
      </div>

      <div class="flex justify-between border-t border-blue-900/20 pt-2 mt-2">
        <span class="text-gray-500">Node Alias:</span>
        <span class="text-gray-300">
          {{ user.alias ?? "ANONYMOUS_PROXIED_NODE" }}
        </span>
      </div>

      <div class="flex justify-between">
        <span class="text-gray-500">Session Latency:</span>
        <span class="text-gray-300">
          {{ (user?.metrics?.latency ?? 12) + "ms" }}
        </span>
      </div>
    </div>
  </section>
</div>
`;

const DemoScript = `
class App extends kasper.Component {
  $onInit() {
    this.user = {
      name: "John Doe",
      role: "Lead Systems Architect",
      roleType: "Administrator",
      lastLogin: "2026-03-10 23:45",
      servers: ["Northeast-01", "EU-West-04", "Tokyo-Edge-09"]
    };

    this.stats = [
      { label: "Memory", value: 84, unit: "%", status: "critical" },
      { label: "CPU", value: 12, unit: "%", status: "healthy" },
      { label: "Uptime", value: 99.9, unit: "%", status: "healthy" },
      { label: "Storage", value: 45, unit: "GB", status: "warning" }
    ];

    this.uptime = kasper.signal(0);
    this.timer = setInterval(() => {
      this.uptime.value++;
    }, 1000);
  }

  $onDestroy() {
    console.log("App component being destroyed, clearing timer...");
    clearInterval(this.timer);
  }

  onClick() {
    alert("Accessing terminal for " + this.user.name + "... Permission granted.");
  }
}

class Card extends kasper.Component {
  $onInit() {
    console.log("Card initialized with args:", this.args);
  }
}

const cardTemplate = \`
  <div class="card p-5 rounded-xl bg-[#1a1c1e] border border-gray-800 h-full shadow-2xl transition-all hover:border-gray-700 group" @class="args.class">
    <div class="border-b border-gray-800 mb-4 pb-2 flex justify-between items-center">
      <div class="text-blue-500 font-mono font-bold tracking-tighter uppercase text-[10px]">
        <slot name="header"></slot>
      </div>
      <div class="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:animate-ping"></div>
    </div>
    <div class="text-gray-400 text-sm leading-relaxed">
      <slot></slot>
    </div>
    <div class="border-t border-gray-800 mt-4 pt-2 text-right italic">
       <slot name="footer"></slot>
    </div>
  </div>
\`;

register("my-card", Card, cardTemplate);
`;

const DemoStyle = `
/* Custom scrollbar for the preview */
#render-area::-webkit-scrollbar {
  width: 6px;
}
#render-area::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}
#render-area::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}

/* Base typography */
h3 {
  letter-spacing: -0.05em;
}
`;
