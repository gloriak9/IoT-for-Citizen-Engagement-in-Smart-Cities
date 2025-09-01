import CommentTool from "./tools/CommentTool";
import LightingTool from "./tools/LightingTool";
import LightingHeatmapTool from "./tools/LightingHeatmapTool";
import FeedbackTool from "./tools/FeedbackTool"; 
import PollTool from "./tools/PollTool"; 


export const toolRegistry = [
  {
    id: "comment",
    label: "📍 Comment",
    component: CommentTool,
  },

  {
    id: "feedback",
    label: "📝 Feedback",
    component: FeedbackTool,
  },

  {
    id: "poll",
    label: "📊 Poll",          
    component: PollTool,      
  },

  {
    id: "lighting",
    label: "💡 Light Sensor Data",
    component: LightingTool,
  },
  
  {
    id: "lighting-heatmap",
    label: "🔥 Lighting Heatmap",
    component: LightingHeatmapTool,
  },

  // You can add more tools here!
];
