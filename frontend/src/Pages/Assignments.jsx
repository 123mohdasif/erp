import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

// --- API SETUP ---
// This creates a reusable axios instance for your API calls.
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// This "interceptor" automatically adds the JWT token to every API request.
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});
// --- END API SETUP ---


// Main Component
export default function Assignments() {
    const { role } = useOutletContext(); // Get the role from the dashboard outlet
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // State for the "Create Assignment" modal (for teachers)
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    // State for the "Submit Work" modal (for students)
    const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionFile, setSubmissionFile] = useState(null);


    // Fetch assignments when the component loads
    useEffect(() => {
        const fetchAssignments = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/assignments/view'); 
                setAssignments(response.data);
            } catch (err) {
                setError('Failed to fetch assignments. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    // Handler for Teacher: Create a new assignment
    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        if (!title || !file) {
            setError('Title and file are required.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('assignmentFile', file);

        try {
            await api.post('/assignments/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const response = await api.get('/assignments/view');
            setAssignments(response.data);
            setCreateModalOpen(false);
            setTitle('');
            setDescription('');
            setFile(null);
            setError(''); // Clear previous errors
        } catch (err) {
            setError('Failed to create assignment.');
            console.error(err);
        }
    };

    // Handler for Student: Submit work for an assignment
    const handleSubmitWork = async (e) => {
        e.preventDefault();
        if (!submissionFile || !selectedAssignment) {
            setError('Please select a file to submit.');
            return;
        }
        
        const formData = new FormData();
        formData.append('submissionFile', submissionFile);

        try {
            await api.post(`/assignments/${selectedAssignment.id}/submit`, formData, {
                 headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Assignment submitted successfully!');
            setSubmitModalOpen(false);
            setSubmissionFile(null);
            setSelectedAssignment(null);
            setError(''); // Clear previous errors
        } catch (err) {
            setError('Failed to submit assignment.');
            console.error(err);
        }
    };

    const openSubmitModal = (assignment) => {
        setSelectedAssignment(assignment);
        setSubmitModalOpen(true);
    };


    if (isLoading) {
        return <div className="p-8 text-center">Loading assignments...</div>;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Assignments</h1>
                    {role === 'teacher' && (
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition"
                        >
                            Create Assignment
                        </button>
                    )}
                </div>

                {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex flex-col">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{assignment.title}</h2>
                            <p className="text-gray-600 mb-4 flex-grow">{assignment.description}</p>
                            <div className="mt-auto pt-4 border-t border-gray-200">
                                {role === 'teacher' ? (
                                    <button className="w-full text-center text-blue-600 font-semibold hover:underline">
                                        View Submissions ({assignment.submission_count || 0})
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => openSubmitModal(assignment)}
                                        className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-600 transition"
                                    >
                                        Submit Your Work
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for Teacher to Create Assignment */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Create New Assignment</h2>
                        <form onSubmit={handleCreateAssignment}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1">Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg"/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg h-24"></textarea>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-1">Assignment File (PDF, DOCX)</label>
                                <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-2 border border-gray-300 rounded-lg"/>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={() => setCreateModalOpen(false)} className="text-gray-600">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Student to Submit Assignment */}
            {isSubmitModalOpen && selectedAssignment && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-2">Submit Work for:</h2>
                        <p className="text-lg text-gray-700 mb-4">{selectedAssignment.title}</p>
                        <form onSubmit={handleSubmitWork}>
                             <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-1">Your File (PDF, DOCX, etc.)</label>
                                <input type="file" onChange={(e) => setSubmissionFile(e.target.files[0])} className="w-full p-2 border border-gray-300 rounded-lg"/>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={() => setSubmitModalOpen(false)} className="text-gray-600">Cancel</button>
                                <button type="submit" className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

