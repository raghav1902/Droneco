import { z } from 'zod';

const phoneRegex = /^\d{10}$/;

export const authLoginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required")
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters")
});

export const createLeadSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  mobile_number: z.string().regex(phoneRegex, "Phone number must be exactly 10 digits").optional().or(z.literal('')),
  city: z.string().min(1, "City is required"),
  filler_type: z.enum(['student', 'guardian']),
  guardian_name: z.string().optional(),
  guardian_relation: z.string().optional(),
  guardian_phone: z.string().optional(),
  interested_course_id: z.string().min(1, "Course interest is required")
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

export const addFeedbackSchema = z.object({
  feedback_text: z.string().min(1, "Remarks are required"),
  next_follow_up_date: z.string().optional().nullable()
});

export const courseSchema = z.object({
  course_name: z.string().min(1, "Course name is required"),
  code: z.string().min(1, "Course code is required"),
  description: z.string().optional(),
  duration_months: z.number({ invalid_type_error: "Must be a number" }).positive("Duration must be a positive number"),
  is_active: z.boolean().optional()
});

export const createQuestionSchema = z.object({
  question_text: z.string().min(1, "Question text is required"),
  step_number: z.coerce.number().int().min(1, "Order must be at least 1"),
  field_type: z.enum(['text', 'dropdown', 'radio', 'checkbox']),
  optionsString: z.string().optional(),
  is_required: z.boolean().optional()
});

export const discountSchema = z.object({
  name: z.string().min(1, "Discount name is required"),
  type: z.enum(['percentage', 'fixed']),
  value: z.number({ invalid_type_error: "Must be a number" }).positive("Value must be a positive number"),
  max_cap: z.number({ invalid_type_error: "Must be a number" }).optional().nullable(),
  is_active: z.boolean().optional()
});

export const collectFeeSchema = z.object({
  amount: z.number({ invalid_type_error: "Must be a number" }).positive("Amount must be a positive number"),
  payment_method: z.enum(['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque']),
  remarks: z.string().optional()
});

export const admissionSchema = z.object({
  lead_id: z.string().min(1, "Lead ID is required"),
  course_id: z.string().min(1, "Course ID is required"),
  total_amount: z.number().min(0, "Total amount must be >= 0"),
  discount_amount: z.number().min(0).optional(),
  tax_amount: z.number().min(0).optional()
});

export const settingsSchema = z.object({
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

export const validateForm = (schema, data) => {
  try {
    schema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {};
      error.errors.forEach(err => {
        if (!errors[err.path[0]]) {
          errors[err.path[0]] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { form: "An unexpected error occurred" } };
  }
};
