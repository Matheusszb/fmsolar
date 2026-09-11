import Image from 'next/image';
import Link from 'next/link';
import { company } from '@/config/company';
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="FM SOLAR — Início">
      <span className="brand-image">
        <Image
          src={company.logo}
          alt="FM SOLAR - Energia Sustentável"
          width={2481}
          height={2481}
          sizes="200px"
          unoptimized
          priority
        />
      </span>
    </Link>
  );
}
