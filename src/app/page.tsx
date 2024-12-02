"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, Timer, Play, Pause, Plus, Minus, RotateCcw, Activity, Server } from 'lucide-react';

const OperationalLawsDemo = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Demonstração das Leis Operacionais</h1>

      <Tabs defaultValue="little">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="little">Lei de Little</TabsTrigger>
          <TabsTrigger value="interactive">Lei do Tempo de Resposta Interativo</TabsTrigger>
          <TabsTrigger value="response">Lei do Tempo de Resposta</TabsTrigger>
        </TabsList>

        <TabsContent value="little">
          <LittleLawDemo />
        </TabsContent>

        <TabsContent value="interactive">
          <InteractiveResponseDemo />
        </TabsContent>

        <TabsContent value="response">
          <ResponseTimeDemo />
        </TabsContent>
      </Tabs>

      <div className='mt-4'>
        Desenvolvidor por <a href='https://github.com/JoaoCardoso00' className='underline'>João Cardoso</a>
      </div>

      <span className='text-gray-100'>
        por favor ale eu preciso passar nessa materia pra me formar eu imploro
      </span>

    </div>
  );
};

// Lei de Little Demo
const LittleLawDemo = () => {
  const [time, setTime] = useState(0);
  const [queue, setQueue] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState({
    lambda: 2,
    W: 5,
    L: 10
  });

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        if (queue.length < metrics.L) {
          setQueue(prev => [...prev, { id: Date.now() }]);
        }
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, queue.length, metrics.L]);

  const handleAddClient = () => {
    if (queue.length < 20) {
      setQueue(prev => [...prev, { id: Date.now() }]);
    }
  };

  const handleRemoveClient = () => {
    if (queue.length > 0) {
      setQueue(prev => prev.slice(0, -1));
    }
  };

  const handleReset = () => {
    setQueue([]);
    setTime(0);
    setIsRunning(false);
  };

  const updateRate = (delta) => {
    setMetrics(prev => ({
      ...prev,
      lambda: Math.max(1, prev.lambda + delta),
      L: Math.max(1, prev.lambda + delta) * prev.W
    }));
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Call Center - Lei de Little (L = λW)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <Clock className="w-8 h-8 mx-auto mb-2" />
            <p>Tempo: {time}s</p>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p>Clientes: {queue.length}</p>
          </div>
          <div className="text-center">
            <Activity className="w-8 h-8 mx-auto mb-2" />
            <p>Taxa: {metrics.lambda}/min</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
          <button onClick={handleAddClient} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            <Plus className="w-4 h-4 inline" /> Adicionar
          </button>
          <button onClick={handleRemoveClient} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            <Minus className="w-4 h-4 inline" /> Remover
          </button>
          <button onClick={handleReset} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            <RotateCcw className="w-4 h-4 inline" /> Reiniciar
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => updateRate(-1)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Diminuir Taxa
          </button>
          <button onClick={() => updateRate(1)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Aumentar Taxa
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {queue.map((client, i) => (
              <div key={client.id} className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Métricas:</h3>
          <ul className="list-disc pl-6">
            <li>L = {metrics.L.toFixed(1)} (clientes no sistema)</li>
            <li>λ = {metrics.lambda} clientes/min (taxa de chegada)</li>
            <li>W = {metrics.W} min (tempo no sistema)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Lei do Tempo de Resposta Interativo Demo
const InteractiveResponseDemo = () => {
  const [users, setUsers] = useState(10);
  const [thinkTime, setThinkTime] = useState(5);
  const [responseTime, setResponseTime] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setActiveUsers(Math.floor(Math.random() * users));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, users]);

  const calculateThroughput = () => {
    return users / (responseTime + thinkTime);
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Sistema Time-Sharing - Lei do Tempo de Resposta Interativo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <div>Usuários: {users}</div>
            <input
              type="range"
              min="1"
              max="20"
              value={users}
              onChange={(e) => setUsers(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="text-center">
            <Timer className="w-8 h-8 mx-auto mb-2" />
            <div>Tempo de Pensar (Z): {thinkTime}s</div>
            <input
              type="range"
              min="1"
              max="10"
              value={thinkTime}
              onChange={(e) => setThinkTime(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="text-center">
            <Clock className="w-8 h-8 mx-auto mb-2" />
            <div>Tempo de Resposta (R): {responseTime}s</div>
            <input
              type="range"
              min="1"
              max="10"
              value={responseTime}
              onChange={(e) => setResponseTime(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className="mb-6 mx-auto block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isRunning ? <Pause className="w-4 h-4 inline mr-2" /> : <Play className="w-4 h-4 inline mr-2" />}
          {isRunning ? 'Pausar' : 'Iniciar'} Simulação
        </button>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: users }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${i < activeUsers ? 'bg-green-500' : 'bg-gray-300'} text-white`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">R = N/X - Z</h3>
          <p className="mb-4">Onde:</p>
          <ul className="list-disc pl-6">
            <li>N = {users} (número de usuários)</li>
            <li>X = {calculateThroughput().toFixed(2)} req/s (throughput)</li>
            <li>Z = {thinkTime}s (tempo de pensar)</li>
            <li>R = {responseTime}s (tempo de resposta)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Lei do Tempo de Resposta Demo
const ResponseTimeDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [subsystems, setSubsystems] = useState([
    { id: 1, name: 'CPU', visits: 25, responseTime: 0.04 },
    { id: 2, name: 'Disco A', visits: 20, responseTime: 0.03 },
    { id: 3, name: 'Disco B', visits: 4, responseTime: 0.025 }
  ]);
  const [activeSystem, setActiveSystem] = useState(null);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setActiveSystem(prev => {
          if (prev === null) return 0;
          return (prev + 1) % (subsystems.length + 1);
        });
      }, 1000);
    } else {
      setActiveSystem(null);
    }
    return () => clearInterval(interval);
  }, [isRunning, subsystems.length]);

  const calculateTotalResponseTime = () => {
    return subsystems.reduce((acc, sys) => acc + sys.visits * sys.responseTime, 0);
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Sistema Computacional - Lei do Tempo de Resposta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isRunning ? <Pause className="w-4 h-4 inline mr-2" /> : <Play className="w-4 h-4 inline mr-2" />}
            {isRunning ? 'Pausar' : 'Iniciar'} Simulação
          </button>
          <div className="text-lg">
            Tempo Total de Resposta: {calculateTotalResponseTime().toFixed(3)}s
          </div>
        </div>

        <div className="grid gap-4 mb-6">
          {subsystems.map((sys, index) => (
            <div
              key={sys.id}
              className={`p-4 rounded-lg ${activeSystem === index ? 'bg-blue-100' : 'bg-gray-50'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-6 h-6" />
                  <h3 className="font-bold">{sys.name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Visitas (Vi)</p>
                    <input
                      type="number"
                      value={sys.visits}
                      onChange={(e) => {
                        const newSystems = [...subsystems];
                        newSystems[index].visits = Number(e.target.value);
                        setSubsystems(newSystems);
                      }}
                      className="w-20 px-2 py-1 border rounded"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tempo (Ri)</p>
                    <input
                      type="number"
                      value={sys.responseTime}
                      onChange={(e) => {
                        const newSystems = [...subsystems];
                        newSystems[index].responseTime = Number(e.target.value);
                        setSubsystems(newSystems);
                      }}
                      className="w-20 px-2 py-1 border rounded"
                      step="0.001"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">R = Σ(Vi × Ri)</h3>
          <p className="mb-4">Onde:</p>
          <ul className="list-disc pl-6">
            {subsystems.map(sys => (
              <li key={sys.id}>
                {sys.name}: {sys.visits} × {sys.responseTime}
                s = {sys.responseTime * sys.visits} segundos
              </li>
            ))}
            <li className="font-bold mt-2">
              Total: {calculateTotalResponseTime().toFixed(3)} segundos
            </li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            O tempo total de resposta é a soma dos produtos do número de visitas pelo tempo de resposta de cada subsistema
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OperationalLawsDemo;
