const { z } = require('zod');

const docTypeEnum = z.enum(['zimra', 'bluebook', 'cid', 'vid', 'zinara', 'insurance', 'invoices']);

const schemas = {
  createVehicle: z.object({
    vin: z.string().min(5),
    licensePlate: z.string().optional(),
    make: z.string().min(1),
    model: z.string().min(1),
    year: z.number().int().min(1900).max(2100),
    price: z.number().nonnegative().optional(),
    mileage: z.number().int().nonnegative().optional(),
    engineNo: z.string().optional(),
    ecuSerial: z.string().optional(),
    gearboxSerial: z.string().optional(),
    transmission: z.string().optional(),
    fuel: z.string().optional(),
    color: z.string().optional(),
    sellerType: z.string().optional(),
    sellerName: z.string().optional()
  }),
  verifyDoc: z.object({ vin: z.string().min(5), docType: docTypeEnum }),
  swapPart: z.object({ vin: z.string().min(5), partName: z.string().min(1), newSerial: z.string().min(1), workshop: z.string().optional() }),
  actionById: z.object({ id: z.union([z.string(), z.number()]) }),
  createEscrow: z.object({ vin: z.string().min(5), amount: z.number().positive(), paymentMethod: z.string().min(1), buyerName: z.string().optional() }),
  simulatePayment: z.object({ escrowId: z.string().min(1), mobileNumber: z.string().min(5), provider: z.string().min(1), amount: z.number().positive() }),
  paynowHook: z.object({ reference: z.string().min(1), status: z.string().min(1), paynowreference: z.string().optional(), amount: z.number().nonnegative().optional() }),
  stolen: z.object({ vin: z.string().min(5), stolen: z.boolean() }),
  chat: z.object({ department: z.string().min(1), sender: z.string().min(1), message: z.string().min(1) }),
  login: z.object({ username: z.string().min(1), role: z.enum(['admin','garage','government','corporate','consumer']) }),
  aiQuery: z.object({ provider: z.enum(['openai','claude','gemini','kimi']), model: z.string().min(1), prompt: z.string().min(1), temperature: z.number().min(0).max(2).optional() })
};

function validateBody(schemaName) {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
    req.body = parsed.data;
    next();
  };
}

module.exports = { validateBody, schemas, docTypeEnum };
