const { z } = require('zod');

// Phone number regex: Exactly 10 digits
const phoneRegex = /^\d{10}$/;

const authLoginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required")
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters")
});

const createLeadSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  mobile_number: z.string().regex(phoneRegex, "Phone number must be exactly 10 digits").optional().or(z.literal('')),
  city: z.string().min(1, "City is required"),
  filler_type: z.enum(['student', 'guardian']),
  guardian_name: z.string().optional(),
  guardian_relation: z.string().optional(),
  guardian_phone: z.string().optional(),
  interested_course_id: z.string().min(1, "Course interest is required"),
  responses: z.array(z.object({
    question_id: z.string(),
    response_value: z.string()
  })).optional()
}).superRefine((data, ctx) => {
  if (data.filler_type === 'guardian') {
    if (!data.guardian_name) {
      ctx.addIssue({ path: ['guardian_name'], message: 'Guardian name is required', code: z.ZodIssueCode.custom });
    }
    if (!data.guardian_relation) {
      ctx.addIssue({ path: ['guardian_relation'], message: 'Relationship is required', code: z.ZodIssueCode.custom });
    }
    if (!data.guardian_phone || !phoneRegex.test(data.guardian_phone)) {
      ctx.addIssue({ path: ['guardian_phone'], message: 'Phone number must be exactly 10 digits', code: z.ZodIssueCode.custom });
    }
    if (!data.full_name) {
      ctx.addIssue({ path: ['full_name'], message: "Student's full name is required", code: z.ZodIssueCode.custom });
    }
  } else {
    if (!data.mobile_number || !phoneRegex.test(data.mobile_number)) {
      ctx.addIssue({ path: ['mobile_number'], message: 'Phone number must be exactly 10 digits', code: z.ZodIssueCode.custom });
    }
  }
});

const updateLeadStatusSchema = z.object({
  status: z.enum(['New', 'Contacted', 'Interested', 'Not Interested', 'Approved', 'Enrolled'], { errorMap: () => ({ message: 'Invalid status' }) })
});

const addFeedbackSchema = z.object({
  feedback_text: z.string().min(1, "Feedback text is required"),
  next_follow_up_date: z.string().optional().nullable()
});

const courseSchema = z.object({
  course_name: z.string().min(1, "Course name is required"),
  code: z.string().min(1, "Course code is required"),
  description: z.string().optional(),
  duration_months: z.number().positive("Duration must be a positive number"),
  is_active: z.boolean().optional()
});

const discountSchema = z.object({
  name: z.string().min(1, "Discount name is required"),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive("Value must be a positive number"),
  max_cap: z.number().optional().nullable(),
  is_active: z.boolean().optional()
});

const collectFeeSchema = z.object({
  student_id: z.string().min(1, "Student ID is required"),
  amount: z.number().positive("Amount must be a positive number"),
  payment_method: z.enum(['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque']),
  remarks: z.string().optional()
});

const settingsSchema = z.object({
  institute: z.object({
    name: z.string().optional(),
    logo: z.string().optional(),
    address: z.string().optional(),
    contact: z.string().optional(),
    email: z.string().email("Invalid email format").optional().or(z.literal(''))
  }).optional(),
  fee: z.object({
    defaultLateFee: z.number().min(0).optional(),
    lateFeeGraceDays: z.number().min(0).optional(),
    admissionFee: z.number().min(0).optional()
  }).optional(),
  receipt: z.object({
    prefix: z.string().optional(),
    header: z.string().optional(),
    footerMessage: z.string().optional(),
    showLogo: z.boolean().optional()
  }).optional()
});

const admissionSchema = z.object({
  lead_id: z.string().min(1, "Lead ID is required"),
  course_id: z.string().min(1, "Course ID is required"),
  total_amount: z.number().min(0, "Total amount must be >= 0"),
  discount_amount: z.number().min(0).optional(),
  tax_amount: z.number().min(0).optional()
});

const createQuestionSchema = z.object({
  question_text: z.string().min(1, "Question text is required"),
  order: z.number().int().min(1, "Order must be at least 1"),
  type: z.enum(['text', 'dropdown', 'radio', 'checkbox']),
  options: z.array(z.string()).optional(),
  is_required: z.boolean().optional()
});

module.exports = {
  authLoginSchema,
  changePasswordSchema,
  createLeadSchema,
  updateLeadStatusSchema,
  addFeedbackSchema,
  courseSchema,
  discountSchema,
  collectFeeSchema,
  settingsSchema,
  admissionSchema,
  createQuestionSchema
};
