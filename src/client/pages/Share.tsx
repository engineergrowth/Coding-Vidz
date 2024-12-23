import { useEffect, useState } from 'react';
import axios from 'axios';
import TagSelector from '../components/TagSelector';
import useFetchTags from '../hooks/useFetchTags';
import { useUser } from '../context/userContext';
import { TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

const PostForm: React.FC = () => {
    const { userId, token } = useUser();
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [instructorName, setInstructorName] = useState('');
    const [tags, setTags] = useState<number[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const { tags: allTags, error } = useFetchTags();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    // TODO: unused consts/fix message

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [userId, navigate]);

    const handleTagChange = (selectedTagIds: number[]) => {
        setTags(selectedTagIds);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId || !token) {
            setMessage({ type: 'error', text: 'You must be logged in to create a post.' });
            return;
        }

        const userIdInt = parseInt(userId, 10);

        try {
            const response = await axios.post(
                `${apiUrl}/posts`,
                {
                    title,
                    video_url: videoUrl,
                    description,
                    user_id: userIdInt,
                    instructor_name: instructorName,
                    tags,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage({ type: 'success', text: 'Post created successfully!' });


            setTimeout(() => {
                navigate(`/watch-vidz`);
            }, 1000);
        } catch (error) {
            console.error('Error creating post:', error);
            setMessage({ type: 'error', text: 'There was an error creating your post. Please try again.' });
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-6 space-y-6 bg-white shadow-lg rounded-md border border-gray-200">

            <div className="text-center">
                <h2 className="text-gray-700 text-2xl font-semibold mb-2">Share Content</h2>
                <p className="text-gray-600">Thank you for contributing to our community!</p>
            </div>

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                </label>
                <TextField
                    id="title"
                    label="Enter the title of your post"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="video-url" className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                </label>
                <TextField
                    id="video-url"
                    label="Paste your video link here"
                    variant="outlined"
                    fullWidth
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description (max 200 characters)
                </label>
                <TextField
                    id="description"
                    label="Add a description (optional)"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value.slice(0, 200));
                    }}
                    helperText={`${description.length}/200 characters`}
                />





            </div>


            <div>
                <label htmlFor="instructor-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor Name
                </label>
                <TextField
                    id="instructor-name"
                    label="Who is the instructor?"
                    variant="outlined"
                    fullWidth
                    value={instructorName}
                    onChange={e => setInstructorName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                </label>
                <TagSelector tags={allTags} onChange={handleTagChange} />
            </div>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ padding: '10px', marginTop: '1rem' }}
            >
                Submit Post
            </Button>
        </form>
    );

};

export default PostForm;

