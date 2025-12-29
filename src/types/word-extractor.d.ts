declare module "word-extractor" {
  class WordDocument {
    getBody(): string;
  }

  class WordExtractor {
    extract(filePath: string): Promise<WordDocument>;
  }

  export default WordExtractor;
}
