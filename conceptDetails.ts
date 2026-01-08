interface ConceptDetail {
  placeholder: string;
  suggestions: string[];
}

export const CONCEPT_DETAILS: Record<string, ConceptDetail> = {
  'Tết Nguyên Đán': {
    placeholder: 'Ví dụ: mặc áo dài đỏ, cầm bao lì xì, bên cạnh cành hoa mai/đào...',
    suggestions: ['Áo dài đỏ', 'Bao lì xì', 'Cành hoa mai', 'Cành hoa đào', 'Mâm ngũ quả'],
  },
  'Giáng Sinh (Noel)': {
    placeholder: 'Ví dụ: mặc áo len đỏ, bên cây thông, tuyết rơi...',
    suggestions: ['Bên cây thông', 'Lò sưởi ấm cúng', 'Hộp quà', 'Tuyết rơi', 'Áo len đỏ'],
  },
  'Năm Mới (New Year)': {
    placeholder: 'Ví dụ: pháo hoa rực rỡ, ly sâm panh, đồng hồ đếm ngược...',
    suggestions: ['Pháo hoa', 'Ly sâm panh', 'Đồng hồ đếm ngược', 'Bữa tiệc sang trọng'],
  },
  'Halloween': {
    placeholder: 'Ví dụ: trang phục phù thủy, quả bí ngô, lâu đài ma ám...',
    suggestions: ['Trang phục phù thủy', 'Quả bí ngô', 'Lâu đài ma ám', 'Kẹo "trick or treat"'],
  },
  'Tết Trung Thu': {
    placeholder: 'Ví dụ: cầm đèn lồng, phá cỗ, ngắm trăng...',
    suggestions: ['Cầm đèn lồng', 'Mặt nạ sư tử', 'Bánh trung thu', 'Ngắm trăng rằm'],
  },
  'Ngày Phụ nữ Việt Nam (20-10)': {
    placeholder: 'Ví dụ: mặc áo dài truyền thống, ôm bó hoa sen...',
    suggestions: ['Áo dài truyền thống', 'Bó hoa sen', 'Bối cảnh phố cổ', 'Nền nã, dịu dàng'],
  },
  'Quốc tế Phụ nữ (8-3)': {
    placeholder: 'Ví dụ: phong cách hiện đại, cầm hoa hồng, ở một quán cà phê sang trọng...',
    suggestions: ['Phong cách hiện đại', 'Bó hoa hồng', 'Quán cà phê sang trọng', 'Tự tin, rạng rỡ'],
  },
  'Valentine (14-2)': {
    placeholder: 'Ví dụ: váy đỏ quyến rũ, nhận hộp socola, nến và hoa hồng...',
    suggestions: ['Váy đỏ quyến rũ', 'Hộp socola', 'Nến và hoa hồng', 'Bữa tối lãng mạn'],
  },
};