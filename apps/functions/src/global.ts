type Translate = (
  key: string,
  params?: string[],
  defaultTranslation?: string
) => string;

type Translation = Record<string, string>;

type Environment = "production" | "development";

type ProjectId = "vantoops-12e74";
