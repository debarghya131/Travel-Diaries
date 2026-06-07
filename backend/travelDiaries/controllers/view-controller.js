import { applyRateLimit, readLimiter, writeLimiter } from "../lib/arcjet";
import WebsiteView from "../models/WebsiteView";

const counterKey = "site";

export const getWebsiteViews = async (req, res) => {
  const allowed = await applyRateLimit(
    readLimiter,
    req,
    res,
    "Too many view counter requests. Please slow down."
  );

  if (!allowed) {
    return;
  }

  try {
    const viewCounter = await WebsiteView.findOneAndUpdate(
      { key: counterKey },
      { $setOnInsert: { count: 0 } },
      { new: true, upsert: true }
    );

    return res.status(200).json({ count: viewCounter.count });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to load view counter" });
  }
};

export const incrementWebsiteViews = async (req, res) => {
  const allowed = await applyRateLimit(
    writeLimiter,
    req,
    res,
    "Too many view counter requests. Please wait a moment."
  );

  if (!allowed) {
    return;
  }

  try {
    const viewCounter = await WebsiteView.findOneAndUpdate(
      { key: counterKey },
      { $inc: { count: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ count: viewCounter.count });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to update view counter" });
  }
};
