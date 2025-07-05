import React, { useState, useEffect } from 'react';
import './App.css';
function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [translate, setTranslate] = useState('');
  const [action, setAction] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);


  const token = localStorage.getItem('token');
  if (!token) window.location.href = '/';

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHistory(data || []);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, [token]);

  const showFile = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const show = document.getElementById('showvdo');
  const url = URL.createObjectURL(file);
  if (show) {
    show.src = url;
    show.style.display = 'block'; // ✅ Show the video after upload
  }
};


  const translation = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/gettranslation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paragraph: transcript }),
      });
      const summarydata = await response.json();
      setTranslate(summarydata.summary);
    } catch (err) {
      console.log(err.message);
    }
  };

  const uploadFile = async () => {
    const input = document.getElementById('video');
    const file = input.files[0];

    if (!file) {
      setError('Please upload a video file!');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/gettranscript', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to get transcript');
      const data = await res.json();
      setTranscript(data.transcript);

      const response = await fetch('http://localhost:5000/api/getsummary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paragraph: data.transcript, filename: file.name }),
      });

      const summarydata = await response.json();
      setSummary(summarydata.summary);

      const response2 = await fetch('http://localhost:5000/api/getactionitems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paragraph: data.transcript, filename: file.name }),
      });

      const actiondata = await response2.json();
      setAction(actiondata.actionItems);

      // 🆕 Optional: Refresh history
      const updated = await fetch('http://localhost:5000/api/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newData = await updated.json();
      setHistory(Array.isArray(newData) ? newData : []);


    } catch (err) {
      console.error("❌ Error:", err.message);
      setError('Error uploading or summarizing');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="app-container">
    {/* Left Sidebar */}
    <div className="sidebar-left">
  <h2 className="sidebar-title">⚙️ Settings</h2>
</div>



    {/* Center Content */}
    <div className="main-content">
      <div className="upload-card">
  <video
  id="showvdo"
  controls
  width="100%"
  style={{ display: 'none', maxHeight: '300px', marginTop: '20px', borderRadius: '10px' }}
></video>
<input
  type="file"
  id="video"
  accept="video/*"
  style={{ display: 'none' }}
  onChange={showFile}
/>

    
  <button
    className="upload"
    onClick={() => document.getElementById('video').click()}
    disabled={loading}
  >
    Upload
  </button>

  <button
    className="upload"
    onClick={uploadFile}
    disabled={loading}
    style={{ marginLeft: '10px' }}
  >
    
    {loading ? 'Processing...' : 'Send'}
  </button>
  

</div>

      {error && <p className="error">{error}</p>}

      <div className="section">
  <h3 className="section-title">📝 Transcript</h3>
  <p className="section-text">{transcript}</p>
  <button
  className="translate-button"
  onClick={translation}
  disabled={!transcript}
  style={{ marginTop: '20px' }}
>
  Translate
</button>
</div>

<div className="section">
  <h3 className="section-title">📋 Summary</h3>
  <p className="section-text">{summary}</p>
</div>

<div className="section">
  <h3 className="section-title">🌍 Translated</h3>
  <p className="section-text">{translate}</p>
</div>

<div className="section">
  <h3 className="section-title">✅ Action Items</h3>
  {Array.isArray(action) ? (
    <ul className="action-list">
      {action.map((item, index) => (
        <li key={index} className="action-item">
          <strong>Action:</strong> {item.action || item.Action} <br />
          <strong>Assignee:</strong> {item.assignee || item.Assignee} <br />
          <strong>Deadline:</strong> {item.deadline || item.Deadline}
        </li>
      ))}
    </ul>
  ) : (
    <p>No action items found.</p>
  )}
</div>

      {Array.isArray(action) ? (
        <ul>
          {action.map((item, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              ✅ <strong>Action:</strong> {item.action || item.Action}<br />
              👤 <strong>Assignee:</strong> {item.assignee || item.Assignee}<br />
              📅 <strong>Deadline:</strong> {item.deadline || item.Deadline}
            </li>
          ))}
        </ul>
      ) : (
        <p>No action items found.</p>
      )}
    </div>

    {/* Right Sidebar */}
    {/* Right Sidebar */}
<div className="sidebar-right">
  <h2>Previous Uploads</h2>
  {history.length === 0 ? (
    <p>No uploads yet.</p>
  ) : (
    history.map((item, idx) => (
      <div
        key={idx}
        className="history-card clickable"
        onClick={() => setSelectedHistory(item)}
      >
        📁 <strong>{item.filename}</strong> <br />
        🕒 {new Date(item.uploadedAt).toLocaleString()}
      </div>
    ))
  )}
</div>

{/* History Modal */}
{selectedHistory && (
  <div className="modal-overlay" onClick={() => setSelectedHistory(null)}>
    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()} // prevent modal from closing when clicking inside
    >
      <h2>{selectedHistory.filename}</h2>
      <p><strong>Uploaded:</strong> {new Date(selectedHistory.uploadedAt).toLocaleString()}</p>

      <h3>Transcript:</h3>
      <p>{selectedHistory.transcript}</p>

      <h3>Summary:</h3>
      <p>{selectedHistory.summary}</p>

      <h3>Action Items:</h3>
      {Array.isArray(selectedHistory.actionItems) && selectedHistory.actionItems.length > 0 ? (
        <ul>
          {selectedHistory.actionItems.map((act, j) => (
            <li key={j} style={{ marginBottom: '8px' }}>
              ✅ <strong>Action:</strong> {act.action || act.Action || 'N/A'}<br />
              👤 <strong>Assignee:</strong> {act.assignee || act.Assignee || 'N/A'}<br />
              📅 <strong>Deadline:</strong> {act.deadline || act.Deadline || 'N/A'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No action items.</p>
      )}

      <button className="close-modal" onClick={() => setSelectedHistory(null)}>
        Close
      </button>
    </div>
  </div>
)}

    </div>
  
);

}

export default App;
