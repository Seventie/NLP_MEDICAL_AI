// Model loader - temporarily disabled to prevent startup issues
// This will be re-enabled once basic server is working

export const modelManager = {
  loadModels: async () => {
    console.log('Models loading skipped for now');
  },
  queryRAGModel: async (question: string) => {
    return {
      answer: `Question received: ${question}. Model integration in progress.`,
      sources: [],
      error: false
    };
  },
  queryRecommendationModel: async (symptoms: string[]) => {
    return {
      medications: [],
      error: false,
      message: `Symptoms received: ${symptoms.join(', ')}. Model integration in progress.`
    };
  },
  getModelStatus: () => {
    return {
      'medical-qa-rag': 'disabled',
      'medicine-recommendation': 'disabled'
    };
  },
  shutdown: async () => {
    console.log('Model manager shutdown');
  }
};
