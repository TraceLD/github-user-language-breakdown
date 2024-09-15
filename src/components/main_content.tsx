import { useState } from 'react';
import { GulbForm, GulbFormValues } from './gulb_form';
import { fetchChartData } from '@/lib/gulb_service';
import { useQuery } from '@tanstack/react-query';
import { LangsChart } from './langs_chart';

export function MainContent() {
  const [name, setName] = useState('');
  const [isOrg, setIsOrg] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ['langsStats', name, isOrg],
    queryFn: async () => await fetchChartData(name, isOrg),
    staleTime: 5 * (60 * 1000),
    gcTime: 10 * (60 * 1000),
    enabled: Boolean(name),
    retry: false,
  });

  const onFormSubmitted = (values: GulbFormValues, isOrg: boolean) => {
    setName(values.name);
    setIsOrg(isOrg);
  };

  return (
    <div className="flex flex-col items-center justify-items-center">
      <GulbForm
        onSubmit={onFormSubmitted}
        isSubmitDisabled={Boolean(isPending && name)}
      />
      <div className="mt-12 w-full">
        <LangsChart
          name={name}
          isPending={Boolean(isPending && name)}
          error={error}
          data={data}
        />
      </div>
    </div>
  );
}
