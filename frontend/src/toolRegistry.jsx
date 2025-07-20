import CommentTool from "./tools/CommentTool";
import LightingTool from "./tools/LightingTool";
import FeedbackTool from "./tools/FeedbackTool"; 
import PollTool from "./tools/PollTool"; 


export const toolRegistry = [
  {
    id: "comment",
    label: "📍 Comment",
    component: CommentTool,
  },
  {
    id: "lighting",
    label: "💡 Light Sensor Data",
    component: LightingTool,
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

  // You can add more tools here!
];
