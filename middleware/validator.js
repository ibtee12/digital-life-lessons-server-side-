// Input Validation and Data Sanitization Middleware

const ALLOWED_CATEGORIES = [
  'Personal Growth',
  'Career',
  'Relationships',
  'Mindset',
  'Mistakes Learned'
];

const ALLOWED_TONES = [
  'Motivational',
  'Sad',
  'Realization',
  'Gratitude'
];

// Helper to escape basic HTML tags to prevent XSS
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

export const validateLessonPayload = (req, res, next) => {
  let { title, description, content, category, emotionalTone, accessLevel, visibility } = req.body;

  // Check required fields
  if (!title || !description || !category || !emotionalTone) {
    return res.status(400).json({
      success: false,
      message: 'Title, description, category, and emotional tone are required fields.'
    });
  }

  // Validate Title Length
  title = sanitizeString(title);
  if (title.length < 3 || title.length > 150) {
    return res.status(400).json({
      success: false,
      message: 'Lesson title must be between 3 and 150 characters.'
    });
  }

  // Validate Description Length
  description = sanitizeString(description);
  if (description.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Description must be at least 10 characters long.'
    });
  }

  // Validate Category Enum
  if (!ALLOWED_CATEGORIES.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Invalid category. Allowed categories: ${ALLOWED_CATEGORIES.join(', ')}`
    });
  }

  // Validate Emotional Tone Enum
  if (!ALLOWED_TONES.includes(emotionalTone)) {
    return res.status(400).json({
      success: false,
      message: `Invalid emotional tone. Allowed tones: ${ALLOWED_TONES.join(', ')}`
    });
  }

  // Attach sanitized fields to req.body
  req.body.title = title;
  req.body.description = description;
  if (content) req.body.content = sanitizeString(content);

  next();
};
