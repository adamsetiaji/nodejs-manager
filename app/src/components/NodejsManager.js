import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Edit2, Trash2 } from 'lucide-react';

const NodejsManager = () => {
 const [view, setView] = useState('list');
 const [apps, setApps] = useState([]);
 const [nodeVersions, setNodeVersions] = useState([]);
 
 const [newApp, setNewApp] = useState({
   nodeVersion: '',
   mode: 'development',
   root: '',
   url: '',
   startup: '',
   envVars: []
 });

 useEffect(() => {
   const fetchNodeVersions = async () => {
     try {
       const response = await fetch('/api/node-versions');
       const versions = await response.json();
       setNodeVersions(versions);
       setNewApp(prev => ({
         ...prev,
         nodeVersion: versions[0] || '20.11.0'
       }));
     } catch (error) {
       console.error('Error fetching Node.js versions:', error);
       const defaultVersions = ['20.11.0', '18.19.0', '16.20.2'];
       setNodeVersions(defaultVersions);
       setNewApp(prev => ({
         ...prev,
         nodeVersion: defaultVersions[0]
       }));
     }
   };

   fetchNodeVersions();
 }, []);

 const handleCreateApp = () => {
   if (!newApp.root || !newApp.url) {
     alert('Application root and URL are required');
     return;
   }
   setApps([...apps, { ...newApp, status: `started (v${newApp.nodeVersion})` }]);
   setView('list');
   setNewApp({
     nodeVersion: nodeVersions[0] || '20.11.0',
     mode: 'development',
     root: '',
     url: '',
     startup: '',
     envVars: []
   });
 };

 const handleDeleteApp = (index) => {
   if (window.confirm('Are you sure you want to delete this application?')) {
     const newApps = apps.filter((_, i) => i !== index);
     setApps(newApps);
   }
 };

 const handleAddEnvVar = () => {
   setNewApp({
     ...newApp,
     envVars: [...newApp.envVars, { name: '', value: '' }]
   });
 };

 const handleUpdateEnvVar = (index, field, value) => {
   const updatedVars = [...newApp.envVars];
   updatedVars[index] = { ...updatedVars[index], [field]: value };
   setNewApp({ ...newApp, envVars: updatedVars });
 };

 const handleRemoveEnvVar = (index) => {
   const updatedVars = newApp.envVars.filter((_, i) => i !== index);
   setNewApp({ ...newApp, envVars: updatedVars });
 };

 return (
   <div className="p-6 max-w-6xl mx-auto">
     <div className="flex items-center gap-4 mb-6">
       <img src="/api/placeholder/48/48" alt="Node.js" className="w-12 h-12" />
       <h1 className="text-2xl font-semibold">Node.js</h1>
     </div>

     <div className="flex gap-4 border-b mb-6">
       <button 
         className={`px-4 py-2 ${view === 'list' ? 'border-b-2 border-blue-500' : ''}`}
         onClick={() => setView('list')}
       >
         WEB APPLICATIONS
       </button>
       {view === 'list' && (
         <button 
           className="ml-auto flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
           onClick={() => setView('create')}
         >
           <Plus size={20} />
           CREATE APPLICATION
         </button>
       )}
     </div>

     {view === 'list' ? (
       <div className="bg-white rounded-lg shadow">
         {apps.length === 0 ? (
           <div className="p-8 text-center text-gray-500">
             No applications found. Click "CREATE APPLICATION" to add one.
           </div>
         ) : (
           <table className="w-full">
             <thead>
               <tr className="border-b">
                 <th className="text-left p-4">App URL</th>
                 <th className="text-left p-4">App Root Directory</th>
                 <th className="text-left p-4">Mode</th>
                 <th className="text-left p-4">Status</th>
                 <th className="text-left p-4">Actions</th>
               </tr>
             </thead>
             <tbody>
               {apps.map((app, idx) => (
                 <tr key={idx} className="border-b">
                   <td className="p-4 text-blue-500">{app.url}</td>
                   <td className="p-4">{app.root}</td>
                   <td className="p-4">
                     <span className={`px-2 py-1 rounded text-sm ${
                       app.mode === 'production' 
                         ? 'bg-blue-100 text-blue-800' 
                         : 'bg-green-100 text-green-800'
                     }`}>
                       {app.mode}
                     </span>
                   </td>
                   <td className="p-4">
                     <span className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500"></span>
                       {app.status}
                     </span>
                   </td>
                   <td className="p-4">
                     <div className="flex gap-2">
                       <button className="p-1 text-gray-600 hover:text-gray-800" title="Restart">
                         <RefreshCw size={18} />
                       </button>
                       <button className="p-1 text-gray-600 hover:text-gray-800" title="Edit">
                         <Edit2 size={18} />
                       </button>
                       <button 
                         onClick={() => handleDeleteApp(idx)}
                         className="p-1 text-gray-600 hover:text-gray-800"
                         title="Delete"
                       >
                         <Trash2 size={18} />
                       </button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         )}
       </div>
     ) : (
       <div className="bg-white rounded-lg shadow p-6">
         <div className="space-y-6">
           <div className="grid grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-medium mb-2">Node.js version</label>
               <select 
                 value={newApp.nodeVersion}
                 onChange={(e) => setNewApp({...newApp, nodeVersion: e.target.value})}
                 className="w-full p-2 border rounded"
               >
                 {nodeVersions.map(version => (
                   <option key={version} value={version}>
                     {version}
                   </option>
                 ))}
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium mb-2">Application mode</label>
               <select
                 value={newApp.mode}
                 onChange={(e) => setNewApp({...newApp, mode: e.target.value})}
                 className="w-full p-2 border rounded"
               >
                 <option value="development">Development</option>
                 <option value="production">Production</option>
               </select>
               <p className="text-sm text-gray-500 mt-1">Adds value for NODE_ENV variable</p>
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium mb-2">Application root</label>
             <input
               type="text"
               value={newApp.root}
               onChange={(e) => setNewApp({...newApp, root: e.target.value})}
               className="w-full p-2 border rounded"
               placeholder="/home/user/app"
             />
             <p className="text-sm text-gray-500 mt-1">Physical address to your application on server</p>
           </div>

           <div>
             <label className="block text-sm font-medium mb-2">Application URL</label>
             <input
               type="text"
               value={newApp.url}
               onChange={(e) => setNewApp({...newApp, url: e.target.value})}
               className="w-full p-2 border rounded"
               placeholder="myapp.domain.com"
             />
             <p className="text-sm text-gray-500 mt-1">HTTP/HTTPS link to your application</p>
           </div>

           <div>
             <label className="block text-sm font-medium mb-2">Application startup file</label>
             <input
               type="text"
               value={newApp.startup}
               onChange={(e) => setNewApp({...newApp, startup: e.target.value})}
               className="w-full p-2 border rounded"
               placeholder="app.js"
             />
           </div>

           <div>
             <div className="flex items-center justify-between mb-2">
               <label className="block text-sm font-medium">Environment variables</label>
               <button 
                 onClick={handleAddEnvVar}
                 className="text-blue-500 text-sm hover:text-blue-700"
               >
                 + ADD VARIABLE
               </button>
             </div>
             
             {newApp.envVars.length === 0 ? (
               <div className="text-center py-8 text-gray-500 border rounded">NO RESULT FOUND</div>
             ) : (
               <div className="space-y-2">
                 {newApp.envVars.map((env, idx) => (
                   <div key={idx} className="flex gap-2 items-center">
                     <input
                       type="text"
                       value={env.name}
                       onChange={(e) => handleUpdateEnvVar(idx, 'name', e.target.value)}
                       placeholder="Name"
                       className="flex-1 p-2 border rounded"
                     />
                     <input
                       type="text"
                       value={env.value}
                       onChange={(e) => handleUpdateEnvVar(idx, 'value', e.target.value)}
                       placeholder="Value"
                       className="flex-1 p-2 border rounded"
                     />
                     <button 
                       onClick={() => handleRemoveEnvVar(idx)}
                       className="p-2 text-red-500 hover:text-red-700"
                     >
                       ×
                     </button>
                   </div>
                 ))}
               </div>
             )}
           </div>

           <div className="flex justify-end gap-2">
             <button 
               onClick={() => setView('list')}
               className="px-4 py-2 border rounded hover:bg-gray-50"
             >
               CANCEL
             </button>
             <button 
               onClick={handleCreateApp}
               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
             >
               CREATE
             </button>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};

export default NodejsManager;