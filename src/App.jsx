import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [usingMockData, setUsingMockData] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    setUsingMockData(false)
    try {
      const response = await fetch('https://adore-backend.onrender.com/api/volunteers')
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setVolunteers(result.data)
      } else {
        setError(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Backend is still waking up. This usually takes 30-60 seconds on free servers.')
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    const mockData = [
      { _id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', mobile: '+91 98765 43210', city: 'Mumbai', domain: 'Volunteering', createdAt: new Date().toISOString() },
      { _id: '2', name: 'Ananya Mehta', email: 'ananya@example.com', mobile: '+91 87654 32109', city: 'Delhi', domain: 'Marketing', createdAt: new Date().toISOString() },
      { _id: '3', name: 'Vijay Patil', email: 'vijay@example.com', mobile: '+91 76543 21098', city: 'Pune', domain: 'Tech for Good', createdAt: new Date().toISOString() }
    ]
    setVolunteers(mockData)
    setUsingMockData(true)
    setError(null)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [retryCount])

  return (
    <div className="admin-container">
      <div className="header-box">
        <div className="titles">
          <h2>Volunteer Applications</h2>
          <p className="subtitle">
            {usingMockData ? (
              <span style={{ color: '#f59e0b' }}>⚠️ Currently viewing <strong>Preview Data</strong> (Local)</span>
            ) : (
              <span>Connected to <strong>adore-backend.onrender.com</strong></span>
            )}
          </p>
        </div>
        <div className="action-buttons">
          {error && !usingMockData && (
            <button className="mock-btn" onClick={loadMockData}>View Preview Example</button>
          )}
          <button className="refresh-btn" onClick={() => setRetryCount(prev => prev + 1)} disabled={loading}>
            {loading ? '🔄 Connecting...' : '↻ Refresh Live Data'}
          </button>
        </div>
      </div>

      {error && !usingMockData && (
        <div className="error-box">
          <div className="error-content">
            <span className="error-icon">⏳</span>
            <div className="error-text">
              <strong>Server is Waking Up</strong>
              <p>The free-tier backend sleeps after inactivity. It will be ready in about 30 seconds.</p>
            </div>
          </div>
          <button className="retry-btn" onClick={() => setRetryCount(prev => prev + 1)}>Retry Connection</button>
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Waiting for backend response...</p>
            <span className="hint">This cold-start happens once after a period of inactivity.</span>
          </div>
        ) : (
          <div className="scroll-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>City</th>
                  <th>Domain</th>
                  <th>Submission Date</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.length > 0 ? (
                  volunteers.map((person) => (
                    <tr key={person._id}>
                      <td className="name-cell">{person.name}</td>
                      <td>{person.email}</td>
                      <td>{person.mobile}</td>
                      <td>{person.city || 'N/A'}</td>
                      <td><span className="domain-tag">{person.domain}</span></td>
                      <td>{new Date(person.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-row">No live data found yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
