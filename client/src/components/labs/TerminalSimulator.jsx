"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Terminal, Sparkles } from "lucide-react";

const commandLibrary = {
  nmap: ["Starting Nmap 7.80 ( https://nmap.org )", "Nmap scan report for 10.11.211.57", "PORT   STATE SERVICE", "22/tcp open  ssh", "80/tcp open  http", "3306/tcp open mysql"],
  gobuster: ["Gobuster v3.1.0", "http://10.11.211.57/                  (Status: 200)    [Size: 4521]", "http://10.11.211.57/admin             (Status: 403)    [Size: 310]"],
  curl: ["HTTP/1.1 200 OK", "Content-Type: text/html; charset=UTF-8", "<title>UNI6CTF Lab Portal</title>", "<h1>Welcome to the Application</h1>"],
  sqlmap: ["starting @sqlmap", "testing connection to the target", "retrieved backend DBMS: MySQL 8.0", "web application vulnerability confirmed"],
  hydra: ["Hydra v9.0" ,"[INFO] Testing ssh://10.11.211.57:22", "[INFO] 1 valid password found", "admin:Password123"],
  smbclient: ["smbclient //10.11.211.57/share -U anonymous", "Anonymous login successful", "Domain=[UNI6NET] OS=[Windows Server 2019] LANMAN1=\""],
  bloodhound: ["Using BloodHound 4.0.5", "Loaded 472 nodes, 580 edges", "Found 3 paths to Domain Admin"],
  help: ["Available commands: nmap, gobuster, curl, sqlmap, hydra, smbclient, bloodhound"]
};

function TerminalRow({ label, value }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 text-sm text-cyber-muted">
      <span className="text-white/80">{label}</span>
      <span className="break-all text-white">{value}</span>
    </div>
  );
}

export default function TerminalSimulator({ initialPrompt = "$" }) {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [output, setOutput] = useState(["Powered by UNI6CTF Cyber Range Shell"]);
  const [loading, setLoading] = useState(false);

  const suggestions = useMemo(
    () => ["nmap -sV 10.11.211.57", "gobuster dir -u http://10.11.211.57", "curl http://10.11.211.57/login", "sqlmap -u 'http://10.11.211.57/?id=1'", "hydra -l admin -P /opt/wordlists/rockyou.txt ssh://10.11.211.57", "smbclient //10.11.211.57/share -N", "bloodhound -u user -p pass"],
    []
  );

  useEffect(() => {
    if (!loading) return;
    const current = history[history.length - 1];
    const response = (commandLibrary[current?.command?.split(" ")[0]?.toLowerCase()] || ["Command not found. Try 'help'."]).slice();
    let index = 0;

    const nextLine = () => {
      if (index >= response.length) {
        setLoading(false);
        return;
      }
      setOutput((currentOutput) => [...currentOutput, response[index]]);
      index += 1;
    };

    const timer = setInterval(nextLine, 260);
    return () => clearInterval(timer);
  }, [history, loading]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!command.trim()) return;
    const commandText = command.trim();
    setHistory((current) => [...current, { command: commandText, timestamp: new Date() }]);
    setOutput((current) => [...current, `${initialPrompt} ${commandText}`]);
    setCommand("");
    setLoading(true);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-black/70 p-5 shadow-[0_0_40px_rgba(255,0,60,0.16)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyber-red">Terminal Simulator</p>
          <h4 className="mt-2 text-xl font-black uppercase text-white">Range Shell</h4>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-cyber-muted">
          <Terminal className="h-4 w-4 text-cyber-red" /> Live Mode
        </div>
      </div>

      <div className="mt-4 space-y-3 rounded-3xl bg-black/20 p-4 font-mono text-sm leading-6 text-white/90">
        {output.map((line, index) => (
          <p key={`out-${index}`} className={index === 0 ? "text-cyber-muted" : ""}>{line}</p>
        ))}
        {loading ? <p className="text-cyber-red">Typing...</p> : null}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <label htmlFor="terminal" className="sr-only">Terminal command</label>
          <input
            id="terminal"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter command..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-cyber-muted"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl border border-cyber-red/40 bg-cyber-red/10 px-4 py-3 text-sm font-black uppercase text-white transition hover:bg-cyber-red/20 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" /> Execute
        </button>
      </form>

      <div className="mt-5 grid gap-2 text-xs uppercase tracking-[0.18em] text-cyber-muted">
        <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-cyber-red" /> Suggested commands</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {suggestions.map((item) => (
            <span key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
