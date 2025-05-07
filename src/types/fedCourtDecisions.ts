export interface AnalysisDocument {
  docref: string
  url: string | null
  text: string
}

export interface AnalysisResult {
  input_sentence: string
  analysis: string
  documents: AnalysisDocument[]
}