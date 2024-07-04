export type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export type TabOption = "properties" | "data" | "home";

export type FlowTabOption = "properties" | "home";

export type MappingTabOption = "properties" | "transformations";
