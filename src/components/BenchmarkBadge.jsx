export default function BenchmarkBadge({ percentile }) {

    const isRare = percentile <= 2;

    const isUnusual = percentile <= 10;

    const bg = isRare ? 'bg-[var(--critical)]' : isUnusual ? 'bg-[var(--high)]' : 'bg-[var(--medium)]';

    return (

        <span className={`${bg} text-white text-xs font-mono px-2 py-0.5 rounded-full font-bold`}>

            ⚠ {percentile < 1 ? '<1%' : `${percentile}%`} of contracts

        </span>

    );

}
