import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Rating, 
  Box, 
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { submitReview } from '../services/PublicContentService';

interface ReviewFormProps {
  open: boolean;
  onClose: () => void;
  bookingId?: string;
  carId?: string;
  customerName?: string;
  customerEmail?: string;
  onSubmitSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  open,
  onClose,
  bookingId,
  carId,
  customerName: initialCustomerName = '',
  customerEmail: initialCustomerEmail = '',
  onSubmitSuccess
}) => {
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState(initialCustomerName);
  const [customerEmail, setCustomerEmail] = useState(initialCustomerEmail);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !comment.trim() || !customerName.trim() || !customerEmail.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (rating < 1 || rating > 5) {
      setError('Please provide a rating between 1 and 5 stars');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const reviewData = {
        bookingId,
        carId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        rating,
        comment: comment.trim(),
      };

      const status = await submitReview(reviewData);
      
      if (status === 200 || status === 201) {
        setSuccess(true);
        // Clear form
        setRating(5);
        setComment('');
        if (!initialCustomerName) setCustomerName('');
        if (!initialCustomerEmail) setCustomerEmail('');
        
        // Call success callback if provided
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        
        // Close dialog after a brief success message
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } catch (err) {
      console.error('Review submission error:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSuccess(false);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Leave a Review</DialogTitle>
      <DialogContent>
        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Thank you for your review! It will be reviewed by our team before being published.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography component="legend" sx={{ mb: 1 }}>
                Rating *
              </Typography>
              <Rating
                name="rating"
                value={rating}
                onChange={(_, newValue) => setRating(newValue)}
                size="large"
              />
            </Box>

            <TextField
              label="Your Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />

            <TextField
              label="Your Email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />

            <TextField
              label="Your Review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
              disabled={loading}
              placeholder="Please share your experience with us..."
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </form>
        )}
      </DialogContent>
      
      {!success && (
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !rating || !comment.trim() || !customerName.trim() || !customerEmail.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ReviewForm;