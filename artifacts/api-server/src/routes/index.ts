import { Router, type IRouter } from "express";
import healthRouter from "./health";
import memoriesRouter from "./memories";
import cafesRouter from "./cafes";
import booksRouter from "./books";
import moviesRouter from "./movies";
import wishlistRouter from "./wishlist";
import capsulesRouter from "./capsules";
import kitchenRouter from "./kitchen";
import reviewsRouter from "./reviews";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statsRouter);
router.use(memoriesRouter);
router.use(cafesRouter);
router.use(booksRouter);
router.use(moviesRouter);
router.use(wishlistRouter);
router.use(capsulesRouter);
router.use(kitchenRouter);
router.use(reviewsRouter);

export default router;
