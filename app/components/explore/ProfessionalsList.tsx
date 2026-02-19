import { FlatList } from "react-native";
import ProfessionalCard from "./ProfessionalCard";

export default function ProfessionalsList({ data }: any) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <ProfessionalCard data={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
}
