import { useState, useEffect } from 'react';
import { Trash2, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const formatDate = (dateArray) => {
  if (!dateArray || dateArray.length < 3) return 'Invalid date';
  const [year, month, day, hour, minute] = dateArray;
  return `${day}/${month}/${year} ${hour}:${minute < 10 ? '0' + minute : minute}`;
};

export default function WorkerAdminPanel() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}api/worker/get-workers`);
      if (!response.ok) {
        throw new Error('Failed to fetch workers');
      }
      const data = await response.json();
      setWorkers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch workers. Please try again later.');
      console.error('Error fetching workers:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorker = async (id) => {
    try {
      setDeletingId(id);
      const response = await fetch(`${backendUrl}api/worker/delete/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete worker');
      }
      
      setWorkers(workers.filter(worker => worker.id !== id));
    } catch (err) {
      setError('Failed to delete worker. Please try again later.');
      console.error('Error deleting worker:', err);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error}</p>
        <button 
          onClick={fetchWorkers}
          className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-800">Worker Management</h1>
        <p className="text-green-600">Manage your workforce from this centralized dashboard</p>
      </div>
      
      <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-green-800">Worker List</h2>
          <button 
            onClick={fetchWorkers} 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            Refresh
          </button>
        </div>
        <p className="text-green-600 text-sm">Total workers: {workers.length}</p>
      </div>

      {workers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-green-700">No workers found in the system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map(worker => (
            <div key={worker.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-shadow">
              <div className="bg-green-600 py-4 px-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold text-lg">Worker ID: {worker.id}</h3>
                  <button
                    onClick={() => deleteWorker(worker.id)}
                    disabled={deletingId === worker.id}
                    className={`${
                      deletingId === worker.id 
                        ? 'bg-gray-400' 
                        : 'bg-red-500 hover:bg-red-600'
                    } text-white p-2 rounded`}
                  >
                    {deletingId === worker.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="text-green-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-800">{worker.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="text-green-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact</p>
                      <p className="text-gray-800">{worker.contactNo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="text-green-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-gray-800 whitespace-pre-line">{worker.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="text-green-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date Joined</p>
                      <p className="text-gray-800">{formatDate(worker.djoined)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}