'use client';

import { api } from '@/trpc/react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns'; // For date formatting

interface ActionLogsDisplayProps {
  // Props can be added here if needed in the future
}

const ITEMS_PER_PAGE = 20;

export function ActionLogsDisplay({}: ActionLogsDisplayProps) {
  const [offset, setOffset] = useState(0);

  const { data, isLoading, error, isFetching } = api.actionLedger.getUserActionHistory.useQuery({
    limit: ITEMS_PER_PAGE,
    offset: offset,
  });

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>Loading action logs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading action logs: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.entries.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No action logs found.
      </div>
    );
  }

  const { entries, total } = data;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const currentPage = Math.floor(offset / ITEMS_PER_PAGE) + 1;

  return (
    <div className="p-4 space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Approved At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.actionTitle}</TableCell>
              <TableCell>{log.actionType}</TableCell>
              <TableCell>{log.status}</TableCell>
              <TableCell>
                {log.amount && log.currency ? `${log.amount} ${log.currency}` : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                {log.approvedAt ? format(new Date(log.approvedAt), 'PPpp') : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {total > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            onClick={() => setOffset(prev => Math.max(0, prev - ITEMS_PER_PAGE))}
            disabled={offset === 0 || isFetching}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setOffset(prev => prev + ITEMS_PER_PAGE)}
            disabled={offset + ITEMS_PER_PAGE >= total || isFetching}
          >
            Next
          </Button>
        </div>
      )}
      {isFetching && <div className="flex justify-center pt-2"><Loader2 className="h-4 w-4 animate-spin" /></div>}
    </div>
  );
} 