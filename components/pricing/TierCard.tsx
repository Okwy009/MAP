export interface TierCardProps {
  name: string;
  priceLabel: string;
  features: string[];
  checkoutUrl: string;
}

export function TierCard({ name, priceLabel, features, checkoutUrl }: TierCardProps) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-6">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="mt-2">
        <span className="text-3xl font-bold">{priceLabel}</span>
        <span className="text-base font-normal text-muted-foreground">/mo</span>
      </p>
      <ul className="mt-6 flex-1 space-y-2 text-sm text-muted-foreground">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span aria-hidden="true">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href={checkoutUrl}
        className="mt-6 block rounded-md bg-primary px-4 py-2 text-center font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Continue with {name}
      </a>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        You&apos;ll complete your purchase securely on Gumroad.
      </p>
    </div>
  );
}
