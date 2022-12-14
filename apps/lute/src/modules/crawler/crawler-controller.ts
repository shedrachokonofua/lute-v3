import { buildControllerFactory } from "../../lib";
import { Context } from "../../context";
import { isCrawlerStatus } from "./crawler-repo";
import { Priority } from "./priority-queue";

export const buildCrawlerController = buildControllerFactory<Context>(
  ({ crawlerInteractor }) => ({
    async putStatus(req, res) {
      const { status } = req.body;
      if (!isCrawlerStatus(status)) {
        return res.status(400).json({ ok: false, error: "invalid status" });
      }
      await crawlerInteractor.setStatus(status);
      return res.json({ ok: true });
    },
    async getStatus(_, res) {
      const status = await crawlerInteractor.getStatus();
      return res.json({ ok: true, data: { status } });
    },
    async getHead(_, res) {
      const current = await crawlerInteractor.queue.peek();
      return res.json({ ok: true, data: { current } });
    },
    async schedule(req, res) {
      const { fileName } = req.body;
      if (!fileName) {
        return res.status(400).json({ ok: false, error: "Invalid fileName" });
      }
      await crawlerInteractor.schedule({
        fileName,
        dedupeKey: Date.now().toString(), // Don't dedupe
        priority: Priority.Express,
      });
      return res.json({ ok: true });
    },
    async clearError(_, res) {
      await crawlerInteractor.clearError();
      return res.json({ ok: true });
    },
    async getError(_, res) {
      const error = await crawlerInteractor.getError();
      return res.json({ ok: true, data: { error } });
    },
    async getMonitor(_, res) {
      return res.json({
        ok: true,
        data: await crawlerInteractor.getMonitor(),
      });
    },
    async empty(_, res) {
      await crawlerInteractor.emptyQueue();
      return res.json({ ok: true });
    },
    async resetQuota(_, res) {
      await crawlerInteractor.resetQuota();
      return res.json({ ok: true });
    },
  })
);
