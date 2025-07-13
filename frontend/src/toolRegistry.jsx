import CommentTool from "./tools/CommentTool";
import LightingTool from "./tools/LightingTool";

export const toolRegistry = [
  {
    id: "comment",
    label: "📝 Comment",
    component: CommentTool,
  },
  {
    id: "lighting",
    label: "💡 Lighting",
    component: LightingTool,
  },
  // You can add more tools here!
];
